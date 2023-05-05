import { DataStore } from '@aws-amplify/datastore';
import { UserSettings } from '../models'; // replace with your own model import

// Define a function to save user settings to DataStore
const saveSettings = async (jsonData) => {
    // Get the current authenticated user's sub ID

    // Check if the user already has a UserSettings object in DataStore
    const existingUserSettings = await DataStore.query(UserSettings);

    // If the user already has a UserSettings object, update it with the new JSON data
    if (existingUserSettings.length > 0) {
        const updatedUserSettings = UserSettings.copyOf(existingUserSettings[0], (updated) => {
            updated.settings = jsonData;
        });
        await DataStore.save(updatedUserSettings);
        console.log('User settings updated successfully');
    } else {
        // If the user does not have a UserSettings object, create a new one with the JSON data
        const newUserSettings = new UserSettings({
            "settings": jsonData,
        });
        await DataStore.save(newUserSettings);
        console.log('New user settings created successfully');
    }
};
export default saveSettings;
