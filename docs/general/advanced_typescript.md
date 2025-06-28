Advanced TypeScript covers powerful features that go beyond basic types and interfaces. Here are some key areas:

---

## **1. Utility Types**

TypeScript provides built-in utility types that make type transformations easier.

### **Partial, Required, Readonly, and Pick**

```typescript
type Person = { name: string; age: number; address?: string }

const partialPerson: Partial<Person> = { name: "John" } // Makes all properties optional
const requiredPerson: Required<Person> = {
  name: "John",
  age: 30,
  address: "NY",
} // Makes all properties required
const readonlyPerson: Readonly<Person> = { name: "John", age: 30 } // Prevents modification
```

### **Record, Omit, and Extract**

```typescript
type UserRoles = "admin" | "user" | "guest"
type RolePermissions = Record<UserRoles, string[]> // Creates an object type with keys from UserRoles

type User = { id: number; name: string; password: string }
type SafeUser = Omit<User, "password"> // Removes `password` from User type

type APIRoutes = "getUser" | "updateUser" | "deleteUser"
type AllowedRoutes = Extract<APIRoutes, "getUser" | "updateUser"> // Extracts matching types
```

---

## **2. Mapped Types**

Dynamically create types based on an existing type.

```typescript
type Optional<T> = { [K in keyof T]?: T[K] }
type Nullable<T> = { [K in keyof T]: T[K] | null }

type User = { name: string; age: number }
type OptionalUser = Optional<User> // { name?: string; age?: number; }
type NullableUser = Nullable<User> // { name: string | null; age: number | null; }
```

---

## **3. Conditional Types**

Types that change based on conditions.

```typescript
type IsString<T> = T extends string ? "Yes" : "No"
type Test = IsString<string> // "Yes"
type Test2 = IsString<number> // "No"

type RemoveArray<T> = T extends Array<infer U> ? U : T
type StringType = RemoveArray<string[]> // string
type NumberType = RemoveArray<number[]> // number
```

---

## **4. Template Literal Types**

Create dynamic string-based types.

```typescript
type Status = "success" | "error" | "loading"
type StatusMessage = `status-${Status}` // "status-success" | "status-error" | "status-loading"
```

---

## **5. Variadic Tuple Types**

Handles tuple transformations.

```typescript
type Tuple<T extends any[]> = [boolean, ...T, number]
type Example = Tuple<[string, Date]> // [boolean, string, Date, number]
```

---

## **6. Advanced Generics**

Generics allow flexibility in defining reusable components.

```typescript
type Identity<T> = T
type UserResponse<T> = { data: T; error?: string }

const userData: UserResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "Alice" },
}
```

---

## **7. Type Guards**

Helps with narrowing types.

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string"
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()) // TypeScript knows it's a string
  }
}
```

---

## **8. Discriminated Unions**

A powerful pattern for handling multiple object types.

```typescript
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number }

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2
    case "square":
      return shape.side ** 2
  }
}
```

---

## **9. Infer Keyword**

Extracts type information within conditional types.

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never

function getName() {
  return "John"
}
type NameType = ReturnType<typeof getName> // string
```

---

## **10. Advanced Function Overloads**

Define multiple function signatures.

```typescript
function format(value: string): string
function format(value: number): string
function format(value: string | number): string {
  return typeof value === "number" ? value.toFixed(2) : value.toUpperCase()
}

const result = format(123.456) // "123.46"
const result2 = format("hello") // "HELLO"
```

---

### **Conclusion**

Advanced TypeScript helps in writing scalable and maintainable code by leveraging its powerful type system. Would you like examples tailored to your specific use case? 🚀

---

## **1. Key Remapping in Mapped Types**

You can rename keys dynamically.

```typescript
type RenameKeys<T> = {
  [K in keyof T as `new_${string & K}`]: T[K]
}

type OldUser = { name: string; age: number }
type NewUser = RenameKeys<OldUser>
// { new_name: string; new_age: number }
```

---

## **2. Recursive Types**

Great for defining deeply nested structures.

```typescript
type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

const jsonData: JSONValue = {
  name: "Alice",
  details: {
    age: 30,
    hobbies: ["coding", "reading"],
  },
}
```

---

## **3. Deep Partial (Recursive Utility Type)**

Make all properties and nested properties optional.

```typescript
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

type Config = { ui: { theme: string; darkMode: boolean } }
type PartialConfig = DeepPartial<Config>

const config: PartialConfig = { ui: { theme: "dark" } } // darkMode is optional
```

---

## **4. Function Composition with Generics**

Define a reusable function type.

```typescript
type Compose = <T, U, V>(f: (x: T) => U, g: (y: U) => V) => (value: T) => V

const compose: Compose = (f, g) => (value) => g(f(value))

const double = (x: number) => x * 2
const square = (x: number) => x * x

const doubleThenSquare = compose(double, square)
console.log(doubleThenSquare(3)) // 36
```

---

## **5. Tuple Manipulation**

Extract first and last elements from a tuple.

```typescript
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

type ExampleTuple = [1, 2, 3, 4]

type FirstElement = First<ExampleTuple> // 1
type LastElement = Last<ExampleTuple> // 4
```

---

## **6. Strongly Typed Event Emitters**

Create an event system with strong typings.

```typescript
type Events = {
  login: { user: string }
  logout: undefined
}

class EventEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: ((payload: T[K]) => void)[] } = {}

  on<K extends keyof T>(event: K, listener: (payload: T[K]) => void) {
    ;(this.listeners[event] ||= []).push(listener)
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    this.listeners[event]?.forEach((listener) => listener(payload))
  }
}

const emitter = new EventEmitter<Events>()

emitter.on("login", (data) => console.log(`User logged in: ${data.user}`))
emitter.emit("login", { user: "Alice" }) // User logged in: Alice
```

---

## **7. Type-safe Object Paths**

Get valid object paths for deep property access.

```typescript
type Path<T, Key extends keyof T = keyof T> = Key extends string
  ? T[Key] extends object
    ? `${Key}.${Path<T[Key]>}`
    : Key
  : never

type User = {
  id: number
  profile: { name: string; age: number }
}

type UserPaths = Path<User>
// "id" | "profile.name" | "profile.age"
```

---

## **8. Enforcing Mutually Exclusive Properties**

Ensure that only one property from a union is used at a time.

```typescript
type XOR<T, U> = T | U extends object
  ?
      | (T & Partial<Record<keyof U, never>>)
      | (U & Partial<Record<keyof T, never>>)
  : T | U

type Person = XOR<{ name: string }, { age: number }>

const valid1: Person = { name: "Alice" } // ✅ OK
const valid2: Person = { age: 30 } // ✅ OK
// const invalid: Person = { name: "Alice", age: 30 }; ❌ Error!
```

---

## **9. Generic Factory Function**

Create a strongly typed factory function.

```typescript
function createFactory<T>(defaultValues: T) {
  return (overrides?: Partial<T>): T => ({ ...defaultValues, ...overrides })
}

const userFactory = createFactory({ name: "Anonymous", age: 18 })

const user1 = userFactory() // { name: "Anonymous", age: 18 }
const user2 = userFactory({ name: "Alice" }) // { name: "Alice", age: 18 }
```

---

## **10. State Machine with Generics**

Define a finite-state machine.

```typescript
type State = "idle" | "loading" | "error" | "success"

type Transition<T extends State> = T extends "idle"
  ? "loading"
  : T extends "loading"
    ? "success" | "error"
    : "idle"

function transition<T extends State>(current: T, next: Transition<T>): void {
  console.log(`Transitioning from ${current} to ${next}`)
}

transition("idle", "loading") // ✅ OK
transition("loading", "success") // ✅ OK
// transition("loading", "idle"); ❌ Error!
```

---

### **Final Thoughts**

These examples showcase how **advanced TypeScript** helps build robust, type-safe, and maintainable applications. Do you have a specific TypeScript challenge or need something tailored to your project? 🚀
