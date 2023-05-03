import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import YoutubeEmbed from '../../components/YoutubeEmbed';
import './Trick.css';

function Trick(props) {
    const {trick} = useParams();
    var embedId, bodyText, headerText, titleText;


    let tricks = props.tricks;
    
    for(var x in tricks) {
        for(var y in tricks[x]) {
            if(y === trick) {
                embedId = tricks[x][y]["embedId"];
                bodyText = tricks[x][y]["body"];
                headerText = tricks[x][y]["description"];
                titleText = tricks[x][y]["title"];
            }
        }
    }

    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        const updateContainerWidth = () => {
            const width = document.querySelector('.video-container').offsetWidth;
            setContainerWidth(width);
            console.log(width)
        };
        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);
        return () => window.removeEventListener('resize', updateContainerWidth);
    }, []);

    const containerHeight = containerWidth * 0.5625;

    return (
        <>
            <h1>{titleText}</h1>
            <div className="video-container" style={{ height: containerHeight }}>
                <YoutubeEmbed embedId={embedId}/>
            </div>
            <div class="text-container">
                <h2>{headerText}</h2>
                <br />
                <p>{bodyText}</p>  
            </div>
            <br /> <br />
        </>
    )
}

export default Trick;
