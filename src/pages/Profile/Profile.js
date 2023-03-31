import { React, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { SliderField } from '@aws-amplify/ui-react';
import Multiselect from 'multiselect-react-dropdown';
import { ConsoleLogger } from '@aws-amplify/core';
import { mul } from '@tensorflow/tfjs';

function Profile() {
const [sliderValue, setSliderValue] = useState(0);
var [multiList, setMultiList] = useState([]);

var restrictedAreaOptions = [{ name: 'Bed', id: 0, restrictedPets: [] }, { name: 'Couch', id: 1, restrictedPets: [] }, { name: 'Chair', id: 2, restrictedPets: []},];

var restrictedPetOptions = [{ name: 'Dog', id: 1 }, { name: 'Cat', id: 2 }, { name: 'Bird', id: 3 },];

const settings = useRef([
    {minimumConfidence: 0},
    {restrictedAreas: []},
]);

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
        setMultiList(multiList.concat(<div id={"restrictedPetSelect" + selectedArea.name}><h3>Restricted Pet for {selectedArea.name}</h3>
        <Multiselect className="restrictedPetSelect" id={selectedArea.name} options={restrictedPetOptions} selectedValues={selectedAreas.find(item => item.name === selectedArea.name)['restrictedPets']} 
        onSelect={(selectedPets, selectedItem) => onSelectPet(selectedPets, selectedItem, selectedArea)/*functions.find(item => item.name === selectedArea.name)['onSelectFunction']*/} onRemove={onRemovePet} displayValue="name" placeholder="Select pets to restrict" /></div>));
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
        

        try{
            var itemIndex = multiList.findIndex(item => item.props.id === "restrictedPetSelect" + removedItem.name);
            console.log("SELECTED ITEM: " + JSON.stringify(multiList[itemIndex]['props']['children'][1]['props']['options'][1]));
            setMultiList(multiList = multiList.filter(function (list, index) { return index !== itemIndex;}));
            console.log("MULTILIST----------" + JSON.stringify(multiList))
        } catch(e) {
            console.error(e);
        }
    
        console.log("Settings on Removal: " + JSON.stringify(settings.current['restrictedAreas']));
    }

    /*
    console.log(selectedArea);
        var result = settings.current['restrictedAreas'].find(item => item.name === 'Bed');
        console.log("RESULTS: " + JSON.stringify(result));
    */

    // PET FUNCTIONS
    

    function onSelectPet(selectedPets, selectedItem, selectedArea) {
        settings.current['restrictedAreas'].find(item => item.name === selectedArea.name)['restrictedPets'] = selectedPets;
        console.log("Restricted Areas: " + JSON.stringify(settings.current['restrictedAreas']));
        settings.current['restrictedAreas'].forEach((area) => {
            console.log(area['name'] + " Restricted Pets (Add): " + JSON.stringify(area['restrictedPets']));
        })
    }

    function onRemovePet(selectedPets, removedItem) {
        //Remove item from array
        settings.current['restrictedAreas'][settings.current['restrictedAreas'].length - 1]['restrictedPets'] = selectedPets;
        settings.current['restrictedAreas'].forEach((area) => {
            console.log(area['name'] + " Restricted Pets (Remove): " + JSON.stringify(area['restrictedPets']));
        })
    }

    return (
        <>
            <h1>Profile</h1>
            <h1>Settings</h1>
            <SliderField id="confidenceSlider"
                label='Minimum Confidence:'
                max={1} step={0.1} size='large'
                value={sliderValue} onChange={setSliderValue}
                filledTrackColor="var(--secondaryColor)"
                thumbColor="var(--backgroundColor)" />

            <h3>Restricted Areas</h3>
            <Multiselect id='restrictedAreaSelect' options={restrictedAreaOptions}
                selectedValues={settings.current['restrictedAreas']}
                onSelect={onSelectArea}
                onRemove={onRemoveArea}
                displayValue="name"
                placeholder='Select areas to restrict'
            />
            {multiList}
        </>
    )

}

export default Profile