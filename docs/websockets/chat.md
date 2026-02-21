# WebSocket Chat API

> **Namespace:** `chat`
> **URL:** `http://<host>:<WEBSOCKET_PORT>/chat`
> **Авторизация:** JWT-токен передаётся при подключении

---

## Подключение

```typescript
import { io } from 'socket.io-client';

const chatSocket = io('http://localhost:3002/chat', {
  auth: { token: '<JWT_TOKEN>' },
});
```

При успешном подключении сервер автоматически подписывает клиента на персональную комнату `user:<userId>`. Это означает, что обновления списка чатов начинают приходить сразу — без дополнительных действий.

---

## Комнаты (rooms)

| Комната | Попадание | Назначение |
|---|---|---|
| `user:<userId>` | Автоматически при подключении | Обновления списка чатов, уведомление о новых чатах |
| `chat:<chatId>` | По событию `joinChat` | Сообщения, индикатор набора текста |

---

## События

### Клиент → Сервер (emit)

#### `getChats`

Запросить список чатов текущего пользователя.

```typescript
chatSocket.emit('getChats', null, (response) => {
  // response: Chat[]
});
```

<details>
<summary>Формат ответа</summary>

```json
[
  {
    "id": 1,
    "createdAt": "2026-02-20T12:00:00.000Z",
    "updatedAt": "2026-02-20T15:30:00.000Z",
    "members": [
      { "id": 1, "username": "alice" },
      { "id": 2, "username": "bob" }
    ],
    "messages": [
      {
        "id": 42,
        "text": "Привет!",
        "chatId": 1,
        "authorId": 2,
        "createdAt": "2026-02-20T15:30:00.000Z",
        "author": { "id": 2, "username": "bob" }
      }
    ]
  }
]
```

`messages` содержит максимум **1 элемент** — последнее сообщение чата (для превью в списке). Чаты отсортированы по `updatedAt` (последняя активность первой).

</details>

---

#### `createChat`

Создать новый чат.

```typescript
chatSocket.emit('createChat', {
  memberIds: [2, 3]   // ID пользователей (создатель добавляется автоматически)
});
```

| Поле | Тип | Описание |
|---|---|---|
| `memberIds` | `number[]` | ID участников чата |

После создания все участники получат событие [`chatCreated`](#chatcreated).

---

#### `joinChat`

Войти в комнату конкретного чата. Сервер проверяет, что пользователь является участником.

```typescript
chatSocket.emit('joinChat', chatId, (response) => {
  // response: { event: 'joinedChat', data: chatId }
});
```

| Параметр | Тип | Описание |
|---|---|---|
| `chatId` | `number` | ID чата |

> После `joinChat` клиент начинает получать [`newMessage`](#newmessage) и [`userTypingMessage`](#usertypingmessage) для этого чата.

---

#### `leaveChat`

Покинуть комнату чата (при навигации назад, закрытии окна чата и т.д.).

```typescript
chatSocket.emit('leaveChat', chatId, (response) => {
  // response: { event: 'leftChat', data: chatId }
});
```

| Параметр | Тип | Описание |
|---|---|---|
| `chatId` | `number` | ID чата |

> После `leaveChat` события `newMessage` и `userTypingMessage` для этого чата перестают приходить. Обновления в `chatListUpdate` **продолжают** приходить через комнату `user:<userId>`.

---

#### `getMessages`

Загрузить историю сообщений чата с курсорной пагинацией.

```typescript
chatSocket.emit('getMessages', {
  chatId: 1,
  cursor: 42,    // опционально: ID сообщения, с которого продолжить
  limit: 50      // опционально: количество (по умолчанию 50)
}, (messages) => {
  // messages: ChatMessage[]
});
```

| Поле | Тип | Обязательно | Описание |
|---|---|---|---|
| `chatId` | `number` | да | ID чата |
| `cursor` | `number` | нет | ID последнего загруженного сообщения |
| `limit` | `number` | нет | Количество сообщений (по умолчанию `50`) |

<details>
<summary>Формат ответа</summary>

```json
[
  {
    "id": 41,
    "text": "Как дела?",
    "chatId": 1,
    "authorId": 1,
    "createdAt": "2026-02-20T15:29:00.000Z",
    "updatedAt": "2026-02-20T15:29:00.000Z",
    "author": { "id": 1, "username": "alice", ... }
  },
  {
    "id": 40,
    "text": "Привет!",
    "chatId": 1,
    "authorId": 2,
    "createdAt": "2026-02-20T15:28:00.000Z",
    "updatedAt": "2026-02-20T15:28:00.000Z",
    "author": { "id": 2, "username": "bob", ... }
  }
]
```

Сообщения отсортированы от **новых к старым** (`createdAt: desc`). Для подгрузки старых сообщений передайте `cursor` — ID последнего сообщения из предыдущей порции.

</details>

---

#### `sendMessage`

Отправить сообщение в чат.

```typescript
chatSocket.emit('sendMessage', {
  chatId: 1,
  text: 'Привет!'
});
```

| Поле | Тип | Описание |
|---|---|---|
| `chatId` | `number` | ID чата |
| `text` | `string` | Текст сообщения (непустой) |

После отправки:
- Все участники **в комнате чата** получат [`newMessage`](#newmessage)
- Все участники **в комнате пользователя** получат [`chatListUpdate`](#chatlistupdate)

---

#### `typingMessage`

Уведомить о наборе текста.

```typescript
chatSocket.emit('typingMessage', chatId);
```

| Параметр | Тип | Описание |
|---|---|---|
| `chatId` | `number` | ID чата |

Остальные участники в комнате чата получат [`userTypingMessage`](#usertypingmessage). Отправитель событие **не получает**.

---

### Сервер → Клиент (on)

#### `chatCreated`

Создан новый чат, в котором текущий пользователь является участником.

```typescript
chatSocket.on('chatCreated', (chat) => {
  // Добавить чат в список
});
```

```json
{
  "id": 5,
  "createdAt": "2026-02-20T16:00:00.000Z",
  "members": [
    { "id": 1, "username": "alice" },
    { "id": 2, "username": "bob" }
  ]
}
```

> Приходит в комнату `user:<userId>`.

---

#### `chatListUpdate`

Обновление для списка чатов — новое сообщение в одном из чатов пользователя.

```typescript
chatSocket.on('chatListUpdate', ({ chatId, lastMessage }) => {
  // Обновить превью и позицию чата в списке
});
```

```json
{
  "chatId": 1,
  "lastMessage": {
    "id": 43,
    "text": "Новое сообщение",
    "chatId": 1,
    "authorId": 2,
    "createdAt": "2026-02-20T15:31:00.000Z",
    "author": { "id": 2, "username": "bob", ... }
  }
}
```

> Приходит в комнату `user:<userId>`. Используйте для обновления превью последнего сообщения и перемещения чата наверх списка.

---

#### `newMessage`

Новое сообщение в открытом чате.

```typescript
chatSocket.on('newMessage', (message) => {
  // Добавить сообщение в ленту
});
```

```json
{
  "id": 43,
  "text": "Новое сообщение",
  "chatId": 1,
  "authorId": 2,
  "createdAt": "2026-02-20T15:31:00.000Z",
  "author": { "id": 2, "username": "bob", ... }
}
```

> Приходит в комнату `chat:<chatId>`. Получают только те, кто вызвал `joinChat`.

---

#### `userTypingMessage`

Кто-то печатает в открытом чате.

```typescript
chatSocket.on('userTypingMessage', ({ chatId, userId, username }) => {
  // Показать индикатор "username печатает..."
});
```

```json
{
  "chatId": 1,
  "userId": 2,
  "username": "bob"
}
```

> Приходит в комнату `chat:<chatId>`, **кроме отправителя**.

---

## Полный пример использования

### Подключение и список чатов

```typescript
import { io, Socket } from 'socket.io-client';

const chatSocket: Socket = io('ws://localhost:3002/chat', {
  auth: { token: localStorage.getItem('jwt') },
});

// При подключении — загрузить список чатов
chatSocket.on('connect', () => {
  chatSocket.emit('getChats', null, (chats) => {
    renderChatList(chats);
  });
});

// Обновление превью в sidebar
chatSocket.on('chatListUpdate', ({ chatId, lastMessage }) => {
  updateChatPreview(chatId, lastMessage);
});

// Новый чат появился
chatSocket.on('chatCreated', (chat) => {
  addChatToList(chat);
});
```

### Работа с конкретным чатом

```typescript
function openChat(chatId: number) {
  // 1. Входим в комнату
  chatSocket.emit('joinChat', chatId);

  // 2. Загружаем историю
  chatSocket.emit('getMessages', { chatId, limit: 50 }, (messages) => {
    renderMessages(messages);
  });

  // 3. Слушаем новые сообщения
  chatSocket.on('newMessage', (message) => {
    if (message.chatId === chatId) {
      appendMessage(message);
    }
  });

  // 4. Индикатор набора
  chatSocket.on('userTypingMessage', ({ chatId: typingChatId, username }) => {
    if (typingChatId === chatId) {
      showTypingIndicator(username);
    }
  });
}

function closeChat(chatId: number) {
  chatSocket.emit('leaveChat', chatId);
}

// Отправка сообщения
function sendMessage(chatId: number, text: string) {
  chatSocket.emit('sendMessage', { chatId, text });
}

// Отправка индикатора набора (с debounce)
let typingTimeout: ReturnType<typeof setTimeout>;
function onInputChange(chatId: number) {
  clearTimeout(typingTimeout);
  chatSocket.emit('typingMessage', chatId);
  typingTimeout = setTimeout(() => {}, 2000);
}
```

### Подгрузка старых сообщений (infinite scroll)

```typescript
function loadOlderMessages(chatId: number, oldestMessageId: number) {
  chatSocket.emit('getMessages', {
    chatId,
    cursor: oldestMessageId,
    limit: 50,
  }, (messages) => {
    prependMessages(messages);
  });
}
```

---

## Жизненный цикл

```
Клиент подключается к ws://host:3002/chat
│
├─ Сервер проверяет JWT
├─ client.join("user:<userId>")        ← автоматически
│
├─ on("chatListUpdate")               ← слушает всегда
├─ on("chatCreated")                   ← слушает всегда
│
├─ emit("getChats")                    ← загрузить список чатов
│
│   Пользователь открывает чат #7
│   │
│   ├─ emit("joinChat", 7)
│   │   └─ client.join("chat:7")      ← проверка членства
│   │
│   ├─ emit("getMessages", {chatId:7, limit:50})
│   │   └─ ← история сообщений
│   │
│   ├─ on("newMessage")               ← новые сообщения в реальном времени
│   ├─ on("userTypingMessage")         ← кто-то печатает
│   │
│   │   Кто-то отправляет сообщение
│   │   │
│   │   ├─ → "newMessage"             → всем в chat:7
│   │   └─ → "chatListUpdate"         → всем участникам в user:<id>
│   │
│   Пользователь уходит из чата #7
│   │
│   └─ emit("leaveChat", 7)
│       └─ client.leave("chat:7")
│       └─ newMessage для #7 больше не приходит
│       └─ chatListUpdate продолжает приходить
│
├─ ...навигация по другим чатам...
│
└─ Отключение (disconnect)
    └─ Все комнаты покидаются автоматически
```
