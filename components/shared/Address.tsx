import { StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api'
import { ComponentProps, Dispatch, SetStateAction, useRef } from 'react'

type AddressProps = {
    setAddress:Dispatch<SetStateAction<string>>,
    country?:string,
    required?:boolean
} & ComponentProps<'div'>

const Address = ({setAddress, required, country, className, ...props}:AddressProps) => {
    const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY!,
        libraries:['places']
      })


      const handlePlacesChange = () => {
        if (searchBoxRef.current) {
          const searchBox = searchBoxRef.current as unknown as google.maps.places.SearchBox;
          const places = searchBox.getPlaces(); // Get the array of places
      
          if (places && places.length > 0) {
            const [place] = places; // Destructure the first place
            // console.log("Selected Place:", place);
            setAddress(place.name || ""); // Use place.name if available
          } else {
            console.warn("No places found");
          }
        }
      };
      

  return (
    <div {...props} className={`${className} z-50`} >
    {
        isLoaded &&
        <StandaloneSearchBox
        onLoad={(searchBox) => {
            searchBoxRef.current = searchBox as unknown as google.maps.places.SearchBox;
          }}
           onPlacesChanged={handlePlacesChange}
        >
            <input
            required={required}
            defaultValue={country}
            type="text"
            className="border-b px-[0.3rem] dark:bg-transparent w-full dark:text-slate-300 py-1 border-b-slate-300 outline-none placeholder:text-[0.7rem]"
            placeholder="type here"
          />
        </StandaloneSearchBox>
    }
    </div>
  )
}

export default Address