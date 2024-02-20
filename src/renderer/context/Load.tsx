import { Context, FunctionComponent, PropsWithChildren, createContext, useState } from "react";

export type LoaderProps =  {
    isLoading:boolean,
    setLoading:React.Dispatch<boolean>,
}

export const LoadContext = createContext<LoaderProps>({isLoading:false, setLoading: () => {}})

export const LoadProvider: FunctionComponent<PropsWithChildren<{}>> = ({children}) => {
    const [isLoading,setLoading] = useState(false)

    return (
        <LoadContext.Provider value={{isLoading, setLoading}}>
            {children}
        </LoadContext.Provider>
    )
}


