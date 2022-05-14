const readline = require('readline');

const args = process.argv;
let commands = [];

function main() {
    setupCommands();
    parseMainCommand();
}

function setupCommands() {
    commands = [
        {
            command: 'help',
            alias: 'h',
            executeHandler: handleHelp,
            helpHandler: showHelpDocumentation
        },
        {
            command: 'add',
            alias: 'a',
            executeHandler: handleAdd,
            helpHandler: showAddDocumentation
        },

        {
            command: 'search',
            alias: 's',
            executeHandler: handleSearch,
            helpHandler: showSearchDocumentation
        },
        {
            command: 'update',
            alias: 'u',
            executeHandler: handleUpdate,
            helpHandler: showUpdateDocumentation
        },

        {
            command: 'delete',
            alias: 'd',
            executeHandler: handleHelp,
            helpHandler: showHelpDocumentation
        },

        {
            command: 'print',
            alias: 'p',
            executeHandler: handlePrint,
            helpHandler: showPrintDocumentation
        },
        {
            command: 'open',
            alias: 'o',
            executeHandler: handleOpen,
            helpHandler: showOpenDocumentation
        },
    
    
    ];
}

function parseMainCommand() {

    if(args.length <= 2) {
        showInstructions();
        return;
    }    

    let mainCommand = args[2];

    try {
        mainCommand = mainCommand.toLowerCase();
    } catch(error) {
        // mainCommand was not a string
        console.log("error, main command is not a string");
    }

    console.log("Main Command: ", mainCommand);
    let commandObj = commands.find((element) => {
        return element.command === mainCommand || element.alias === mainCommand;
    });
    
    if(!!commandObj) {
        commandObj.executeHandler();
    }
    else {
        handleInvalidCommand(mainCommand);
    }
}

function showInstructions() {
    console.log("---RECIPES CLI---");
    console.log("To view available commands, run: node index.js help");
    console.log("To view details about a command, run: node index.js help 'command'");
}

function handleInvalidCommand(mainCommand) {
    console.log(`No command '${mainCommand}', please run 'node index.js help'`);
}


function showHelpDocumentation() {
    console.log("RECIPE CLI -- HELP COMMAND");
    console.log("Full: help, Alias: h");
    console.log("Usage:");
    console.log("node index.js help");
    console.log("node index.js help 'command'");
    console.log("Examples")
    console.log("Print list of commands: node index.js help");
    console.log("Print documentation for search command: node index.js help search");
}

function handleHelp() {
    if(args.length > 3) {
        let commandRequested = args[3];
        let commandFound = commands.find(element => {
            return element.command === commandRequested || element.alias === commandRequested;
        });
        if(!!commandFound) {
            commandFound.helpHandler();
            return;
        } else {
            handleInvalidCommand(commandRequested);
        }
    }
    else {
        handleGenericHelp();
    }
}

function handleGenericHelp() {
    console.log("---RECIPES CLI AVAILABLE COMMANDS---");
    console.log("Full Name: Help.  Alias: h");
    console.log("Full Name: Add.  Alias: a");
    console.log("Full Name: Search.  Alias: s");
    console.log("Full Name: Update.  Alias: u");
    console.log("Full Name: Delete.  Alias: d");
    console.log("Full Name: Print.  Alias: p");
    console.log("Full Name: Open.  Alias: o");
}



function showAddDocumentation() {}

async function handleAdd() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));
    // rl.on('close', () => process.exit(0));

    try {
        const name = await prompt('Recipe Name: ');
        const prepTime = await prompt('Prep Time: ');
        const cookTime = await prompt('Cook Time: ');
        let ingredients = [];
        let input = '';
        do {
            input = await prompt('Enter Ingredient (leave blank to continue): ');
            if(input.trim() !== '') {
                ingredients.push(input);
            }
        } while(input.trim() !== '');

        let directions = [];
        do {
            input = await prompt('Enter Direction: ');
            if(input.trim() !== '') {
                directions.push(input);
            }
        } while(input.trim() !== '');

        let notes = [];
        do {
            input = await prompt('Enter note: ');
            if(input.trim() !== '') {
                notes.push(input);
            }
        } while(input.trim() !== '');

        let tags = [];
        do {
            input = await prompt('Enter tag: ');
            if(input.trim() !== '') {
                tags.push(input);
            }
        } while(input.trim() !== '');

        let newRecipe = {
            name: name,
            prepTime: prepTime,
            cookTime: cookTime,
            ingredients: ingredients,
            directions: directions,
            notes: notes,
            tags: tags
        };
        
        console.log(newRecipe);

    } catch(e) {
        console.log("Input error");
        console.log(e);
        rl.close();
    }

    rl.close();
}



function showSearchDocumentation() {}

function handleSearch() {}



function showUpdateDocumentation() {}

function handleUpdate() {}



function showDeleteDocumentation() {}

function handleDelete() {}



function showPrintDocumentation() {}

function handlePrint() {}



function showOpenDocumentation() {}

function handleOpen() {}



main();




