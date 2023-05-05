import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Clips.css'
import { DataStore } from '@aws-amplify/datastore';
import { Session } from '../../models';
import { Storage } from '@aws-amplify/storage';
import { Card, Divider, Expander, ExpanderItem, Badge, Theme, ThemeProvider, Loader } from '@aws-amplify/ui-react';
import DeleteSession from '../../controllers/DeleteSession';

function Clips() {
    const [clip, setClip] = useState([]);
    const [videoData, setVideoData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // add a loading state

    useEffect(() => {
        let subscription;
        const getDate = async () => {
            await DataStore.clear();
            subscription = DataStore.observeQuery(Session).subscribe(({ items }) => {
                const sortedItems = items.sort((b, a) => new Date(a.createdAt) - new Date(b.createdAt));
                setClip(sortedItems);
                setIsLoading(false);
            });
        };
        getDate();
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
    }, []);

    useEffect(() => {
        const getVideoURLs = async (clips) => {
            const urls = {};
            for (const clip of clips) {
                const fileName = clip.fileName;
                try {
                    const url = await Storage.get(fileName, { level: "private" });
                    const response = await fetch(url);
                    const blob = await response.blob();
                    urls[fileName] = URL.createObjectURL(blob);
                } catch (error) {
                    console.error(`Error fetching video URL for ${fileName}:`, error);
                }
            }
            setIsLoading(false); // set the loading state to false when the data is available
            setVideoData((prevURLs) => ({
                ...prevURLs,
                ...urls,
            }));
        };
        clip.forEach((session) => {
            const clips = session.clip.Clips;
            getVideoURLs(clips);
        });

    }, [clip]);

    // Render the loading spinner conditionally based on the loading state
    if (isLoading) {
        return <div className="loading-screen"> <Loader size="large" className="loader" /> </div>;
    }

    return (
        <>
            <h1> All Clips </h1>
            <br />
            <div className="cards">
                <Expander type='single' isCollapsible={true}> 
                    {clip.map((session) => (
                        <Expander type='multiple' isCollapsible={true} key={session.id}>
                            {console.log('SESSION ID: ' + session.id)}
                            <ExpanderItem title={`Session #${clip.findIndex(item => item.id === session.id) + 1}: ${new Date(session.start).toLocaleString()} - ${new Date(session.end).toLocaleString()}`} value='session-expander'>
                                {/* multiList.findIndex(item => item.props.id === "restrictedPetSelect" + removedItem.name); */}
                                {session.clip.Clips.map((clip) => (
                                    <Expander type='multiple' isCollapsible={true} key={clip.fileName}>
                                        <ExpanderItem title={`Clip #${session.clip.Clips.findIndex(item => item.fileName === clip.fileName) + 1}: ${new Date(clip.start).toLocaleString()} - ${new Date(clip.end).toLocaleString()}`} value='clip-expander'>
                                            <Link to={`/clips/${clip.fileName}`}>
                                                <Card className="pet-card">
                                                    {videoData && videoData[clip.fileName] && (
                                                        <video controls src={videoData[clip.fileName]} className="clip-video" />
                                                    )}
                                                    {clip.IncidentList.map((incident) => (
                                                            <Badge id={incident.concat("Badge")}>{incident}</Badge>
                                                        ))
                                                    }
                                                </Card>
                                            </Link>
                                        </ExpanderItem>
                                    </Expander>
                                ))}
                                <br/>
                                <DeleteSession session={session} className='deleteSessionBtn'/>
                            </ExpanderItem>
                        </Expander>
                    ))}
                </Expander>
            </div>
            <br />
        </>
    );
}

export default Clips;
