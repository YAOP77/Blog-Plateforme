// "use client"

// import { createContext, useState, ReactNode } from "react"

// interface User {
//     id: number;
//     name: string;
//     email: string;
// }

// interface UserContextType {
//     user: User | null;
//     setUser: (user: User | null) => void;
// }

// export const UserContext = createContext<UserContextType | undefined>(undefined);

// const UserProvider = ({ children }: { children: ReactNode }) => {
//     const [ user, setUser ] = useState<User | null>(null);

//     return (
//         <UserContext.Provider value={{ user, setUser }}>
//             { children }
//         </UserContext.Provider>
//     )
// }

// export default UserProvider;