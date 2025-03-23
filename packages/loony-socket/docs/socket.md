A WebSocket frame follows a specific structure. The first few bytes contain important control information such as the opcode, masking, and payload length.

### **WebSocket Frame Structure (RFC 6455)**

A WebSocket frame consists of the following parts:

| Bit                  | 0 - 3                           | 4                       | 5 - 7 | 8 - 14 | 15 - 31 | 32+ |
| -------------------- | ------------------------------- | ----------------------- | ----- | ------ | ------- | --- |
| Byte 1               | FIN, RSV1, RSV2, RSV3           | Opcode                  |
| Byte 2               | Mask bit                        | Payload length (7 bits) |
| Byte 3-6 (if Masked) | Masking key (4 bytes, optional) |
| Byte 7+              | Payload Data (if any)           |

---

### **Example WebSocket Frame in Hex**

Let’s say we want to send a **small unmasked text message** `"Hi"` via WebSocket.

#### **Hex Representation**

```
81 02 48 69
```

#### **Breakdown:**

1. **First Byte (Opcode and FIN)**

   - `81` → `1000 0001` (Binary)
     - **FIN**: `1` (Final frame)
     - **RSV1-RSV3**: `000` (Unused, should be 0)
     - **Opcode**: `0001` (Text frame)

2. **Second Byte (Mask and Payload Length)**

   - `02` → `0000 0010` (Binary)
     - **Mask bit**: `0` (No masking)
     - **Payload Length**: `2` (Message length is 2 bytes)

3. **Payload Data ("Hi")**
   - `48` (`H` in ASCII)
   - `69` (`i` in ASCII)

---

### **Example WebSocket Frame with Masking (Required for Client-to-Server Messages)**

A WebSocket message sent from a **client** must be masked. Here’s how the same `"Hi"` message would look when masked:

```
81 82 A1 B2 C3 D4 E9 D0 AA B5
```

#### **Breakdown:**

1. **First Byte (`81`)** - Same as before.
2. **Second Byte (`82`)**
   - **Mask bit**: `1` (masked)
   - **Payload Length**: `2`
3. **Masking Key (`A1 B2 C3 D4`)**
4. **Masked Payload** (Calculated as `Original Byte ⊕ Masking Byte`):
   - `H (0x48) ⊕ A1 = E9`
   - `i (0x69) ⊕ B2 = D0`
   - So, masked payload is `E9 D0`

---

### **Common Opcodes**

| Opcode (Hex) | Meaning            |
| ------------ | ------------------ |
| `0x0`        | Continuation frame |
| `0x1`        | Text frame         |
| `0x2`        | Binary frame       |
| `0x8`        | Close connection   |
| `0x9`        | Ping               |
| `0xA`        | Pong               |

---

### **Final Notes**

- **Clients always send masked messages** (mask bit = `1`).
- **Servers never mask messages** (mask bit = `0`).
- **Masking is done using a 4-byte key**, XORing the payload byte-by-byte.
- **Payload can be extended**: If longer than 125 bytes, extra length bytes are used.

Here are two full WebSocket frames for sending `"Hello, World!"`—one as a **text message** and one as **binary data**.

---

## **1. Text Frame: `"Hello, World!"`**

A WebSocket **text frame** with **masking (required for client-to-server messages)**.

### **Hex Dump**

```
81 8D 37 FA 21 3D 5F 97 4C 51 4D DF 1A 1B 07 D6 0B 4D 0E
```

### **Breakdown**

| Byte                                     | Value          | Explanation                                   |
| ---------------------------------------- | -------------- | --------------------------------------------- |
| `81`                                     | `1000 0001`    | **FIN=1**, **RSV=000**, **Opcode=0x1** (Text) |
| `8D`                                     | `1000 1101`    | **Mask=1**, **Payload length=13**             |
| `37 FA 21 3D`                            | Masking Key    | **XOR key** to decode payload                 |
| `5F 97 4C 51 4D DF 1A 1B 07 D6 0B 4D 0E` | Masked Payload | **Masked `"Hello, World!"`**                  |

#### **Decoding the Payload**

We XOR each byte with the corresponding masking key byte.

| Mask Key      | `37`       | `FA`          | `21`       | `3D` |
| ------------- | ---------- | ------------- | ---------- | ---- |
| `5F` (masked) | `H` (`48`) | `97` (masked) | `e` (`65`) |
| `4C` (masked) | `l` (`6C`) | `51` (masked) | `l` (`6C`) |
| `4D` (masked) | `o` (`6F`) | `DF` (masked) | `,` (`2C`) |
| `1A` (masked) | ` ` (`20`) | `1B` (masked) | `W` (`57`) |
| `07` (masked) | `o` (`6F`) | `D6` (masked) | `r` (`72`) |
| `0B` (masked) | `l` (`6C`) | `4D` (masked) | `d` (`64`) |
| `0E` (masked) | `!` (`21`) | -             | -          |

Thus, **decoded payload** → `"Hello, World!"`

---

## **2. Binary Frame**

Let’s send the **binary equivalent** of `"Hello, World!"` as raw bytes.

### **Hex Dump**

```
82 8D 1F A2 3B 7D 57 C7 4C 49 58 1B 1A 38 2D 1F 56 3B
```

### **Breakdown**

| Byte                                  | Value          | Explanation                                     |
| ------------------------------------- | -------------- | ----------------------------------------------- |
| `82`                                  | `1000 0010`    | **FIN=1**, **RSV=000**, **Opcode=0x2** (Binary) |
| `8D`                                  | `1000 1101`    | **Mask=1**, **Payload length=13**               |
| `1F A2 3B 7D`                         | Masking Key    | **XOR key**                                     |
| `57 C7 4C 49 58 1B 1A 38 2D 1F 56 3B` | Masked Payload | **Masked `"Hello, World!"` as binary**          |

Decoding follows the same XOR process as the text frame.

---

## **Final Notes**

- The **text frame** (`Opcode 0x1`) ensures data is UTF-8 encoded.
- The **binary frame** (`Opcode 0x2`) transmits raw data (e.g., images, files).
- Both frames are **masked**, as required for client-to-server messages.
- If sent from **server to client**, the mask bit would be `0` (`81 0D ...` for text).

Here are the full forms of the WebSocket frame fields:

1. **FIN** → **Final Fragment**

   - Indicates whether this is the last frame in a message.
   - `1` → Last frame
   - `0` → More frames will follow (continuation frames expected)

2. **RSV1** → **Reserved 1**
3. **RSV2** → **Reserved 2**
4. **RSV3** → **Reserved 3**

The **RSV (Reserved) bits** are usually set to `0` unless an extension (like compression) is used. They are meant for future protocol extensions.
