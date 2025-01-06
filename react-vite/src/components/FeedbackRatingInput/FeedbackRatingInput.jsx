import { TbMoodSadSquint } from "react-icons/tb";
import { BiHappy } from "react-icons/bi";
import { PiSmileyMeh } from "react-icons/pi";
import { useEffect, useState } from 'react';
import './FeedbackRatingInput.css';

const FeedbackRatingInput = ({ rating, disabled, onChange }) => {
    const [activeRating, setActiveRating] = useState(rating);

    useEffect(() => {
      setActiveRating(rating)
    }, [rating])

    return (
      <>
      <div className='feedback-input'>
        <div
          className={activeRating > 0 ? 'filled' : 'empty'}
          onMouseEnter={() => disabled ? setActiveRating(rating) : setActiveRating(1)}
          onMouseLeave={() => setActiveRating(rating)}
          onClick={() => onChange(1)}>
          <TbMoodSadSquint />
        </div>
        <div
          className={activeRating > 1 ? 'filled' : 'empty'}
          onMouseEnter={() => disabled ? setActiveRating(rating) : setActiveRating(2) }
          onMouseLeave={() => setActiveRating(rating)}
          onClick={() => onChange(2)}>
          <PiSmileyMeh />
        </div>
        <div
          className={activeRating > 2 ? 'filled' : 'empty'}
          onMouseEnter={() => disabled ? setActiveRating(rating) : setActiveRating(3) }
          onMouseLeave={() => setActiveRating(rating)}
          onClick={() => onChange(3)}>
          <BiHappy />
        </div>
        {/* <p>Reactions</p> */}
      </div>
      </>
    );
  };

  export default FeedbackRatingInput;