const delayInSeconds = 15;

setTimeout(() => {
  // Execute your desired command here
  const {exec} = require("child_process");
  exec("cmd /c curl http://tweet", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing your command: ${error}`);
      return;
    }
    console.log(`Your command output: ${stdout}`);
  });
}, delayInSeconds * 1000);
