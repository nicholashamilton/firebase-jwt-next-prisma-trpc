import { useUser, UseUser } from "./useUser";
import { createGenericContext } from "../createGenericContext";

interface Props {
    children: React.ReactNode;
}

const [useUserContext, UserContextProvider] = createGenericContext<UseUser>();

const UserProvider = ({ children }: Props) => {

    const userUserData = useUser();

    return (
        <UserContextProvider
            value={{ ...userUserData }}
        >
            {children}
        </UserContextProvider>
    );
};

export { UserProvider, useUserContext };
