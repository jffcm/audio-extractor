import inquirer from 'inquirer';
import { exec } from 'node:child_process';
import chalk from 'chalk';
import { promisify } from 'util';
import ora from 'ora';

const execPromise = promisify(exec);

async function extractAudioFromVideo(inputPath, outputPath, format) {
    const command = `ffmpeg -i ${inputPath} -map a -c:a copy ${outputPath}.${format}`; 
    const spinner = ora('Extracting audio...').start()

    try {
        await execPromise(command);
        spinner.succeed(chalk.green(`Extraction successful! The audio is located at ${outputPath}.`));
    } catch (error) {
        spinner.fail(chalk.red(`${error.name} executing the command "${command}"`, error));
    }    
}

(async function main() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'inputPath',
            message: 'Please provide the input path: ',
        },
    
        {
            type: 'input',
            name: 'outputPath',
            message: 'Please provide the output path: ',
        },
    
        {
            type: 'list',
            name: 'format',
            message: 'Select the audio format: ',
            choices: ['mp4', 'avi', 'mkv', 'mov'],
        },
    ]);  

    const { inputPath, outputPath, format } = answers;
    await extractAudioFromVideo(inputPath, outputPath, format);
})();