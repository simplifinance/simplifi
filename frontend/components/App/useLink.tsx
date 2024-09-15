import React from "react";

export default function useLink() {
    const [link, setLink] = React.useState<React.JSX.Element>(
        <h3 className='text-xl font-semibold text-orange-400'>Dashboard</h3>
    );

    const setlink = (arg: React.JSX.Element) => setLink(arg);

    return{
        link,
        setlink,
    }

}