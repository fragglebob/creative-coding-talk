import React, {FC, ReactNode} from "react";

export const StyledNode: FC<{ title: string, children?: ReactNode }> = ({title, children}) => {
    return <div className="block bg-white border-blue-500 border-2 rounded w-40 text-center">
        <div className="text-black px-1 py-2">{title}</div>
        {children ? <div className=" border-t-2 border-blue-500 p-1 pt-2">{children}</div> : null}
    </div>
}