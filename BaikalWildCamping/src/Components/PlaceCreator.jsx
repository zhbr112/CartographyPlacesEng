import { useAuth } from "../provider/authProvider"
import PlaceCard from "./PlaceCard";

export default function PlaceCreator({ close: close, longitude: longitude, latitude: latitude }) {
    const [firstName, photoUrl] = useAuth();
    const [tags, setTags] = useState([]);

    return (
        <div>
            <PlaceCard addedAt={new Date()} addedBy={{ firstName: firstName, photoUrl: photoUrl }} isVerified={false} latitude={latitude} longitude={longitude} imageUrl='' tags={tags} />
        </div>
    )
}