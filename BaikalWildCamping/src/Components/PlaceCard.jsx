import TagContainer from "./TagContainer";
import { TbRosetteDiscountCheck, TbRosetteDiscountOff } from "react-icons/tb";

export default function PlaceCard({ longitude: longitude, latitude: latitude, addedBy: addedBy, imageUrl: imageUrl, tags: tags, addedAt: addedAt, isVerified: isVerified, className: className = '' }) {
    function ConvertDDToDMS(D, lng) {
        return {
            dir: D < 0 ? (lng ? "W" : "S") : lng ? "E" : "N",
            deg: 0 | (D < 0 ? (D = -D) : D),
            min: 0 | (((D += 1e-9) % 1) * 60),
            sec: (0 | (((D * 60) % 1) * 6000)) / 100,
        };
    }

    function dms(d, lng) {
        let res = ConvertDDToDMS(d, lng);

        return `${res.deg}° ${res.min}' ${res.sec}" ${res.dir}`;
    }

    return (
        <div className={'min-w-[32rem] gap-y-0 bg-white shadow-xl rounded-3xl p-5 ' + className}>
            <div className="grid grid-cols-2 gap-5">
                <div className='max-h-full'>
                    <img src={imageUrl} className='rounded-xl object-cover' />
                </div>
                <div className='text-left align-top'>
                    <p className='font-bold text-2xl text-black text-nowrap'>{dms(latitude, false)}</p>
                    <p className='font-bold text-2xl text-black text-nowrap'>{dms(longitude, true)}</p>
                    <div className='ml-1 flex items-center' style={{ lineHeight: '10px' }}>
                        {isVerified ? (<>
                            <TbRosetteDiscountCheck color='#0085FF' className='inline size-6 mr-1 align-baseline' />
                            <p className='text-[#0085FF] font-semibold inline text-sm'>Верифицировано</p>
                        </>) : (<>
                            <TbRosetteDiscountOff color='#FCA600' className='inline size-6 mr-1 align-baseline' />
                            <p className='text-amber-800 font-semibold inline text-sm'>Не верифицировано</p>
                        </>)}
                    </div>
                    <div className='flex items-center mt-5'>
                        <img src={addedBy.photoUrl} className='inline ring-1 ring-gray-900 size-8 rounded-full' />
                        <p className='text-gray-900 text-lg font-semibold ml-2'>{addedBy.firstName}</p>
                    </div>
                    <p className='text-xs font-light text-gray-800 mt-2'>Добавлено {("0" + addedAt.getDate()).slice(-2)}.{("0" + (addedAt.getMonth() + 1)).slice(-2)}.{addedAt.getFullYear()}</p>
                </div>
            </div>
            <div className='w-full col-span-2 text-left my-0 mt-3 align-top'>
                <TagContainer className='w-full my-0' isStatic={true} tags={tags} />
            </div>
        </div>
    )
}