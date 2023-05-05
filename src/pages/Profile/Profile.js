import { React, useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { SliderField, SwitchField } from '@aws-amplify/ui-react';
import Multiselect from 'multiselect-react-dropdown';
import AudioRecord from '../../controllers/AudioRecord';
import AudioPlayer from '../../controllers/AudioPlayer';
import { ConsoleLogger } from '@aws-amplify/core';
import { mul } from '@tensorflow/tfjs';
import saveSettings from '../../controllers/SaveSettings';
import { DataStore } from '@aws-amplify/datastore';
import { UserSettings } from '../../models'; // replace with your own model import

function Profile() {
    // Default Settings
    const settings = useRef(
        {
            "recordClips": true,
            "minimumConfidence": 0,
            "personDetection": true,
            "restrictedAreas": []
        }
    );

    const [isRecordClipsChecked, setIsRecordClipsChecked] = useState(true);
    const [isPersonDetectionChecked, setIsPersonDetectionChecked] = useState(true);
    const [sliderValue, setSliderValue] = useState(0);
    var [multiList, setMultiList] = useState([]);

    const [jsonData, setJsonData] = useState({}); // Used to save state of settings as json data -BP

    var restrictedAreaOptions = [{ name: 'Bed', id: 0, restrictedPets: [] }, { name: 'Couch', id: 1, restrictedPets: [] }, { name: 'Chair', id: 2, restrictedPets: [] },];

    var restrictedPetOptions = [{ name: 'Dog', id: 1 }, { name: 'Cat', id: 2 }, { name: 'Bird', id: 3 },];

    useEffect(() => {
        async function fetchSettings() {
            try {
                const existingUserSettings = await DataStore.query(UserSettings);
                console.log(existingUserSettings.settings);
                if (existingUserSettings.length > 0) {
                    const jsonData = existingUserSettings[0].settings;
                    // Update global vars with fetched data
                    setSliderValue(jsonData.minimumConfidence);
                    setIsPersonDetectionChecked(jsonData.personDetection);
                    setIsRecordClipsChecked(jsonData.recordClips);
                    console.log(`user settings updated Conf: ${jsonData.minimumConfidence} person: ${jsonData.personDetection} record: ${jsonData.recordClips}`);
                    //console.log(`user settings are Conf: ${confidenceMin} person: ${personDetection} record: ${recordClips}`  );
                }
                else {
                    setSliderValue(0.4);
                    setIsPersonDetectionChecked(true);
                    setIsRecordClipsChecked(true);
                    console.log("no user settings");
                }
            } catch (error) {
                console.error('Failed to fetch user settings:', error);
            }
        };
        fetchSettings();
    },[]);

    /*
    "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "password123",
        "recordClips": true,
        "minimumConfidence": 0,
        "personDetectiong": true,
        "restrictedAreas": [
            {"name":"Bed","id":0,"restrictedPets":[{"name":"Dog","id":1},{"name":"Cat","id":2},{"name":"Bird","id":3}]},
            {"name":"Couch","id":1,"restrictedPets":[{"name":"Dog","id":1},{"name":"Cat","id":2},{"name":"Bird","id":3}]},
            {"name":"Chair","id":2,"restrictedPets":[{"name":"Dog","id":1},{"name":"Cat","id":2},{"name":"Bird","id":3}]}
            ]
        */

    /*
    restrictedAreaOptions.forEach((area) => {
        functions.push({
            area: area.name, onSelectFunction: function onSelectPet(selectedPets, selectedItem, selectedArea) {
                settings.current['restrictedAreas'].find(item => item.name === area.name)['restrictedPets'] = selectedPets;
                console.log("Restricted Areas: " + JSON.stringify(settings.current['restrictedAreas']));
                settings.current['restrictedAreas'].forEach((option) => {
                    console.log(option['name'] + " Restricted Pets (Add): " + JSON.stringify(option['restrictedPets']));
                })
            }
        })
    })
    */

    //console.log("Functions: " + JSON.stringify(functions['onSelectFunctions']));
    //settings.current = {minimumConfidence: sliderValue, restrictedAreas: selectedAreas,};

    //console.log("Intial Settings: " + JSON.stringify(settings.current));
    /*
    { name: 'Bed', id: 1, restrictedPets: [{ name: 'Dog', id: 1 }, { name: 'Cat', id: 2 }] },
    { name: 'Couch', id: 2, restrictedPets: [{ name: 'Cat', id: 1 }] }
    */

    function onSelectArea(selectedAreas, selectedArea) {
        //console.log("All Selected Areas: " + JSON.stringify(selectedAreas));
        //console.log("Selected Area: " + JSON.stringify(selectedAreas[selectedAreas.length - 1]));
        //console.log("Selected Area: " + selectedArea.name);
        settings.current['restrictedAreas'] = selectedAreas;
        try {
            setMultiList(multiList.concat(<div key={selectedArea.name} id={'restrictedPetSelect'.concat(selectedArea.name)} ><h3>Pets Not Allowed On The {selectedArea.name}</h3>
                <Multiselect className="restrictedPetSelect" id={"restrictedPetSelect".concat(selectedArea.name)} options={restrictedPetOptions} selectedValues={selectedAreas.find(item => item.name === selectedArea.name)['restrictedPets']}
                    onSelect={(selectedPets, selectedItem) => onSelectPet(selectedPets, selectedItem, selectedArea)/*functions.find(item => item.name === selectedArea.name)['onSelectFunction']*/} onRemove={(selectedPets, removedItem) => onRemovePet(selectedPets, removedItem, selectedArea)} displayValue="name" placeholder="Select pets to restrict" /></div>));
        } catch (e) {
            console.error(e);
        }
    }

    function onRemoveArea(selectedAreas, removedItem) {
        /* console.log("REMOVING ITEM");
        console.log("SELECTED AREAS: " + JSON.stringify(settings.current['restrictedAreas']));

        console.log("Restricted Pets Before Removal: " + settings.current['restrictedAreas'].find(item => item.name === removedItem.name)['restrictedPets']); */
        settings.current['restrictedAreas'].find(item => item.name === removedItem.name)['restrictedPets'] = [];
        settings.current['restrictedAreas'] = selectedAreas;
        try {
            console.log('MULTILIST: ' + JSON.stringify(multiList));
            var itemIndex = multiList.findIndex(item => item.props.id === "restrictedPetSelect" + removedItem.name);
            console.log("ITEM INDEX: " + itemIndex)
            console.log("SELECTED ITEM: " + JSON.stringify(multiList[itemIndex]['props']['children'][1]['props']['options'][1]));
            setMultiList(multiList = multiList.filter(function (list, index) { return index !== itemIndex; }));
        } catch (e) {
            console.error(e);
        }
        settings.current['restrictedAreas'].forEach((area) => {
            console.log("Settings on Removal: " + area['name'] + "Restricted Pets:" + JSON.stringify(area['restrictedPets']));
        })
        console.log("Settings on Removal: " + JSON.stringify(settings.current['restrictedAreas']));
        console.log("MULTILIST----------" + JSON.stringify(multiList[0]['props']['children'][1]['props']['id']));
        console.log("SELECTED VALUES----------" + JSON.stringify(multiList[0]['props']['children'][1]['props']['selectedValues']));
    }

    // PET FUNCTIONS

    function onSelectPet(selectedPets, selectedItem, selectedArea) {
        settings.current['restrictedAreas'].find(item => item.name === selectedArea.name)['restrictedPets'] = selectedPets;
        console.log("Restricted Areas: " + JSON.stringify(settings.current['restrictedAreas']));
        settings.current['restrictedAreas'].forEach((area) => {
            console.log(area['name'] + " Restricted Pets (Add): " + JSON.stringify(area['restrictedPets']));
        })
    }

    function onRemovePet(selectedPets, removedItem, selectedArea) {
        //Remove item from array
        settings.current['restrictedAreas'].find(item => item.name === selectedArea.name)['restrictedPets'] = selectedPets;
        settings.current['restrictedAreas'].forEach((area) => {
            console.log(area['name'] + " Restricted Pets (Remove): " + JSON.stringify(area['restrictedPets']));
        })
    }
    /* Example JSON Data
    {   
        "name": "John Doe",
        "email": "john.doe@example.com",
        "password": "password123",
        "RecordClips": true,
        "MinimumConfidence": 0,
        "PersonDetectiong": true,
        "RestrictedAreas": [
            {"name":"Bed","id":0,"restrictedPets":[{"name":"Dog","id":1},{"name":"Cat","id":2},{"name":"Bird","id":3}]},
            {"name":"Couch","id":1,"restrictedPets":[{"name":"Dog","id":1},{"name":"Cat","id":2},{"name":"Bird","id":3}]},
            {"name":"Chair","id":2,"restrictedPets":[{"name":"Dog","id":1},{"name":"Cat","id":2},{"name":"Bird","id":3}]}
            ]
    
    }
    */
    // Used to save the current json settings to the database -BP
    const handleSave = async () => {
        const jsonData = {
            "recordClips": isRecordClipsChecked,
            "minimumConfidence": sliderValue,
            "personDetection": isPersonDetectionChecked,
            "restrictedAreas": []
        }

        await saveSettings(jsonData);
    };

    return (
        <>
            <h1>Profile</h1>
            {/*Put User Information Form Here*/}

            <h1>Settings</h1>
            <h2>Record Clips</h2>
            <SwitchField
                isChecked={isRecordClipsChecked}
                name='recordClips'
                onChange={(e) => {
                    setIsRecordClipsChecked(e.target.checked);
                }}
                label='Record Clips'
                labelPosition='start'
                thumbColor={'var(--backgroundColor)'}
                trackCheckedColor={'var(--secondaryColor)'}
            ></SwitchField>

            <SliderField id="confidenceSlider"
                label='Minimum Confidence:'
                max={1} step={0.1} size='large'
                value={sliderValue} onChange={setSliderValue}
                filledTrackColor="var(--secondaryColor)"
                thumbColor="var(--backgroundColor)" />

            <SwitchField
                isChecked={isPersonDetectionChecked}
                name='personDetection'
                onChange={(e) => {
                    setIsPersonDetectionChecked(e.target.checked);
                }}
                label='Person Detection'
                labelPosition='start'
                thumbColor={'var(--backgroundColor)'}
                trackCheckedColor={'var(--secondaryColor)'}
            ></SwitchField>

            <h3>Restricted Areas</h3>
            <Multiselect id='restrictedAreaSelect' options={restrictedAreaOptions}
                selectedValues={settings.current['restrictedAreas']}
                onSelect={onSelectArea}
                onRemove={onRemoveArea}
                displayValue="name"
                placeholder='Select areas to restrict'
            />
            {multiList}
            <br />
            <hr />
            <br />
            <AudioRecord />
            <br />
            <AudioPlayer />
            <br />
            <h1>Save User Settings</h1>
            <button onClick={handleSave}>Save</button>
        </>
    )
}
export default Profile