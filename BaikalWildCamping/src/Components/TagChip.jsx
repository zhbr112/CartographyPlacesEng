import { Button, Typography } from "@material-tailwind/react";
import { useState } from "react"
import Cross from "../assets/cross.svg?react"

export default function TagChip({ tagName: TagName, tagIcon: TagIcon, className: classNames, onToggle: toggleProcessor, isStatic: isStatic = false }) {
    const [enabled, setEnabled] = useState(false);

    function handleToggle() {
        setEnabled(p => !p);

        toggleProcessor(!enabled);
    }

    return (
        <Button className={`rounded-3xl text-xs pl-3 pr-3 h-min lowercase w-max ${classNames}`} color={enabled || isStatic ? 'black' : 'white'} onClick={isStatic ? null : handleToggle}>
            {enabled ? (
                <Cross fill='white' className='mr-1 size-4 inline' />
            ) : (
                <TagIcon className='mr-1 size-4 inline' />
            )}
            <Typography className='text-xs inline text-nowrap'>{TagName}</Typography>
        </Button>
    )
}