import localforage from "localforage";

function PlayAudio() {

    const MicRecorder = require('mic-recorder-to-mp3');
    const mp3Recorder = new MicRecorder({bitRate: 128});
    let audio = new Audio();

    function startRecording() 
    {
        mp3Recorder.start().then(() => {
        
        }).catch((error) => {
        console.error(error);
        });
    }

    function stopRecording()
    {
        mp3Recorder.stop().getMp3().then(([buffer, blob]) => {
        console.log(buffer, blob);
        const file = new File(buffer, 'audio.mp3', {
            type: blob.type,
            lastModified: Date.now()
        });
        
        localforage.setItem("currentFile", file);
        }).catch((error) => {
        console.error(error);
        });
    }

    function clearAudio()
    {
        localforage.removeItem("currentFile");
    }

    function playAudio()
    {
        localforage.getItem("currentFile").then((value) => {
        const file = value;
        audio = new Audio(URL.createObjectURL(file));
        audio.play();
        }).catch((error) => {
        console.error(error);
        });
    }
}
export default PlayAudio;