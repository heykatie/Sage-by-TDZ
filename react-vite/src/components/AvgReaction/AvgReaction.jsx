import { TbMoodSadSquint } from "react-icons/tb";
import { PiSmileyMeh } from "react-icons/pi";
import { BiHappy } from "react-icons/bi";

export default function AvgReaction(rating) {
    if(rating.rating === 1) {return (<><TbMoodSadSquint className='sad-face'/></>);}
    else if(rating.rating === 2) {return (<><PiSmileyMeh className='meh-face'/></>)}
    else {return (<><BiHappy className='happy-face'/></>)}
}