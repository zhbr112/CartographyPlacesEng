import { Fragment } from "react"
import TagChip from "./TagChip"

export default function TagContainer({ className: classNames, tags: tags, setEnabledTags: setTags, isStatic: isStatic = false }) {

    const handleToggle = (tag, enabled) => {
        if (enabled) setTags(p => [...p, tag.id]);
        else setTags(p => p.filter(x => x != tag.id));
    };

    return (
        <div className={`flex gap-2 flex-wrap ${classNames}`}>
            {tags.map((tag) => (
                <Fragment key={tag.name}>
                    <TagChip tagName={tag.name} tagIcon={tag.icon} onToggle={(enabled) => handleToggle(tag, enabled)} isStatic={isStatic} />
                </Fragment>
            ))}
        </div>
    );
}