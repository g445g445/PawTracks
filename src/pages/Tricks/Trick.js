import React from 'react';
import { useParams } from 'react-router-dom';
import YoutubeEmbed from '../../components/YoutubeEmbed';
import './Trick.css';

function Trick(props) {
    console.log('Tricks: ' + Object.keys(props));
    const {trick} = useParams();
    var embedId;

    let tricks = props.tricks;
    /* let tricks = {
        Dog: {
            Sit: {name: 'Sit', embedId: "EDgi2sLlWAU"},
            Shake: {name: 'Shake', embedId: "G3-hec29wII"},
            Lay: {name: 'Lay', embedId: "hHKtUp9-xbc"}
        },
        Cat: {
            Come: {name: 'Come', embedId: "OFjlF7zQF_g"},
            HighFive: {name: 'High Five', embedId: "4NWS0mtjMuw"},
            Stay: {name: 'Stay', embedId: "WLetRnjCEtU"}
        },
        Bird: {
            Talk: {name: 'Talk', embedId: "PiPk8GS8UqM"},
            PlayDead: {name: 'Play Dead', embedId: "RZ4dJ7nV1wI"},
            Fly: {name: 'Fly', embedId: "oHFkF4ZQp_4"}
        }
    } */
    
    for(var x in tricks) {
        for(var y in tricks[x]) {
            if(y === trick) {
                embedId = tricks[x][y]["embedId"];
            }
        }
    }
    
    return (
        <>
            <h1>{trick}</h1>
            <YoutubeEmbed embedId={embedId}/>
        </>
    )
}

export default Trick