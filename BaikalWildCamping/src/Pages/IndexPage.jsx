import { useState, useEffect } from "react";
import axios, * as others from 'axios';
import TagContainer from "../Components/TagContainer";
import { TbBeer, TbBike, TbBottle, TbBuildingBridge2, TbCampfire, TbFish, TbGrain, TbHexagons, TbToiletPaper } from "react-icons/tb";
import { FaPlus, FaWater, FaXmark } from "react-icons/fa6";
import { PiCellTower, PiHandCoins } from "react-icons/pi";
import PlaceCollection from "../Components/PlaceCollection";
import { YMap, YMapComponentsProvider, YMapDefaultFeaturesLayer, YMapDefaultSchemeLayer, YMapListener } from "ymap3-components";
import Pin from "../Components/Pin";
import { useAuth } from "../provider/authProvider";

export default function IndexPage() {
    const { token } = useAuth();

    const [enabledTags, setEnabledTags] = useState([]);

    var tags = [
        {
            id: 0,
            name: 'fresh water',
            icon: TbBottle
        },
        {
            id: 1,
            name: 'mobile connection',
            icon: PiCellTower
        },
        {
            id: 2,
            name: 'fire pit',
            icon: TbCampfire
        },
        {
            id: 3,
            name: 'restroom',
            icon: TbToiletPaper
        },
        {
            id: 4,
            name: 'shore',
            icon: FaWater
        },
        {
            id: 5,
            name: 'fishing',
            icon: TbFish
        },
        {
            id: 6,
            name: 'cycling',
            icon: TbBike
        },
        {
            id: 7,
            name: 'fee',
            icon: PiHandCoins
        },
        {
            id: 8,
            name: 'sand',
            icon: TbGrain
        },
        {
            id: 9,
            name: 'rocks',
            icon: TbHexagons
        },
        {
            id: 10,
            name: 'platform',
            icon: TbBuildingBridge2
        },
    ];

    const [places, setPlaces] = useState([]);

    const [isAddMode, setIsAddMode] = useState(false);

    const clickHandler = (layer, spot, object) => {
        //navigate(`/add/${spot.coordinates[0]}/${spot.coordinates[1]}`);
        window.location.href = `/add/${spot.coordinates[0]}/${spot.coordinates[1]}`;
        //else layer.entity.element.click();
    };

    useEffect(() => {
        let params = new URLSearchParams({
            longitude: 104.86,
            latitude: 51.72,
            radius: 1000,
            count: 1000,
        });

        let uri = 'https://zhbr.1ffy.ru/places/get?' + params;

        for (let i = 0; i < enabledTags.length; i++) {
            uri += `&tags=${enabledTags[i]}`;
        }

        axios.get(uri).then(res => {
            // Map places to initial objects
            let temp = res.data.places.map(data => ({
                id: data.place.id,
                author: data.author,
                addedAt: new Date(Date.parse(data.place.addedAt)),
                latitude: data.place.latitude,
                longitude: data.place.longitude,
                tags: data.place.tags.map(tag => tags[tag]),
                verified: data.place.verified
            }));

            // Fetch images for each place
            const imagePromises = temp.map(place =>
                axios.get(`https://zhbr.1ffy.ru/photos/${place.id}`)
                    .then(imageRes => ({
                        ...place,
                        images: imageRes.data // Assuming the response is an array of image links
                    }))
                    .catch(err => {
                        console.log(`Error fetching images for place ${place.id}:`, err);
                        return { ...place, images: [] }; // Return place with empty images array on error
                    })
            );

            // Wait for all image requests to resolve
            Promise.all(imagePromises)
                .then(placesWithImages => {
                    setPlaces(placesWithImages);
                })
                .catch(err => console.log('Error processing image requests:', err));
        }).catch(err => console.log('Error fetching places:', err));
    }, [enabledTags])

    return (
        <>
            <div className='fixed top-3 left-3 flex pointer-events-none z-10'>
                <div className='pr-3 w-1/4 min-w-[35rem] pointer-events-auto hidden md:block'>
                    <PlaceCollection places={places} />
                </div>
                <TagContainer className='w-[60vw] flex gap-2 h-min ml-3 pointer-events-auto' tags={tags} setEnabledTags={setEnabledTags} />
            </div>

            <div className={'z-20 fixed bottom-10 right-5 rounded-full p-7 text-lg ' + (token ? '' : 'hidden')} style={{ backgroundColor: isAddMode ? 'green' : 'white' }} onClick={() => setIsAddMode(p => !p)}>
                {!isAddMode ? <FaPlus /> : <FaXmark />}
            </div>

            <div className='bottom-0 right-0 fixed h-screen w-screen'>
                <YMapComponentsProvider apiKey='5f247f55-074a-4c6f-912a-e1920a225f99' lang='ru_RU'>
                    <YMap id='map' theme='dark' mode='vector' location={{ center: [104.86, 51.72], zoom: 10 }}>
                        {places.map(place => (<Pin key={place.id} place={place} />))}
                        <YMapDefaultFeaturesLayer />
                        <YMapDefaultSchemeLayer />
                        {isAddMode && <YMapListener layer='any' onClick={clickHandler} />}
                    </YMap>
                </YMapComponentsProvider>
            </div>
        </>
    )
}
