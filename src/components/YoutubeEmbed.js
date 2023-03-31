import React from "react";
import propTypes from "prop-types";

const YoutubeEmbed = ({ embedId }) => (
    <div className="video-responsive">
        <iframe 
            width="853" 
            height="480" 
            src={`https://www.youtube.com/embed/${embedId}`} 
            frameBorder="0" 
            //allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
        />
    </div>
);

YoutubeEmbed.propTypes = {
    embedId: propTypes.string.isRequired
};

export default YoutubeEmbed;