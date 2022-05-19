const readline = require('readline');
const fs = require('fs');

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



function showAddDocumentation() {
    console.log("RECIPE CLI -- ADD COMMAND");
    console.log("\nFull: add, Alias: a");
    console.log("\nUsage:");
    console.log("node index.js add");
    console.log("\nExamples");
    console.log("Start the prompt for creating a new recipe: node index.js add");
    console.log("\nDetails:");
    console.log("You will be asked for different properties of a recipe.");
    console.log("You can leave any answer blank to move ahead to the next prompt.");
    console.log("One of the questions will be if you want to split the ingredient list");
    console.log("An example would be if you want to have one set of ingredients for the cake and one set for the frosting");  
    console.log("Once you have finished the recipe, it will be added to the recipes.json");
}

async function handleAdd() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

    try {
        const name = await prompt('Recipe Name: ');
        const prepTime = await prompt('Prep Time: ');
        const cookTime = await prompt('Cook Time: ');
        const servings = await prompt('Servings: ');

        let input = '';
        let splitIngredients = false;
        do {
            input = await prompt('Split Ingredient? (y/n): ');
            input = input.trim();
            
            if(input === 'y') {
                splitIngredients = true;
            } else if(input === 'n') {
                splitIngredients = false;
            }

        } while(input !== 'y' && input !== 'n');

        let ingredients = [];
        let ingredientSections = [];
        let ingredientSection = {};
        let ingredientSectionItems = [];
        let sectionHeader = '';
        if(splitIngredients) {
            let addAnotherSection = true;
            do {
                ingredientSection = {};
                ingredientSectionItems = [];
                sectionHeader = '';
                input = await prompt('Enter Ingredient Section Header(leave blank to continue): ');
                if(input.trim() === '') {
                    addAnotherSection = false;
                } else {
                    sectionHeader = input;
                    do {
                        input = await prompt('Enter Ingredient (leave blank to continue): ');
                        if(input.trim() !== '') {
                            ingredientSectionItems.push(input);
                        }
                    } while(input.trim() !== '');
                    ingredientSection = {
                        sectionHeader,
                        ingredientSectionItems 
                    };
                    ingredientSections.push(ingredientSection);
                }
            } while(addAnotherSection)
        } else {
            do {
                input = await prompt('Enter Ingredient (leave blank to continue): ');
                if(input.trim() !== '') {
                    ingredients.push(input);
                }
            } while(input.trim() !== '');
        }
        

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

        rl.close();

        let newRecipe = {
            name: name,
            prepTime: prepTime,
            cookTime: cookTime,
            servings: servings,
            ingredients: ingredients,
            ingredientSections: ingredientSections,
            directions: directions,
            notes: notes,
            tags: tags
        };
        
        console.log(newRecipe);

        addRecipeToPersistence(newRecipe);

    } catch(e) {
        console.log("Input error");
        console.log(e);
        rl.close();
    }
}

async function addRecipeToPersistence(recipe) {
    getRecipesFromPersistence((recipes) => {
        recipes.push(recipe);
        fs.writeFile('recipes.json', JSON.stringify(recipes), (err) => {
            if(err) {
                console.log("Error writing to file");
                console.error(err);
            }
        });
    });
}

function getRecipesFromPersistence(callback) {
    fs.readFile('recipes.json', 'utf8', (err, data) => {
        if(err) {
            console.log("recipes.json did not exist");
            callback([]);
        } else {
            try {
                let existingData = JSON.parse(data);
                recipes = existingData;
                callback(recipes);
            } catch(e) {
                console.log("Error parsing existing recipes.");
                console.log("Have you touched the file?");
                return;
            }
        }
    });
}



function showSearchDocumentation() {
    console.log("RECIPE CLI -- SEARCH COMMAND");
    console.log("\nFull: search, Alias: s");
    console.log("\nUsage:");
    console.log("node index.js search name=name tags=tag1,tag2 ingredients=ing1,ing2");
    console.log("\nExamples");
    console.log("List all recipes: node index.js s");
    console.log("List all recipes with curry in the name: node index.js s name=curry");
    console.log("List all recipes with the dessert tag: node index.js s t=dessert");
    console.log("List all recipes with the dessert tag that includes chocolate: node index.js s t=dessert i=chocolate");
    console.log("\nDetails:");
    console.log("All of the additional args are optional.");
    console.log("Tags and ingredients should each be a comma separated list");
}

function handleSearch() {
    let name = '';
    let tags = [];
    let ingredients = [];
    let arg = '';
    
    for(let index = 3; index < args.length; index++) {
        arg = args[index].toLowerCase();
        name = getNameFilter(name, arg);
        tags = getTagsFilter(tags, arg);
        ingredients = getIngredientsFilter(ingredients, arg);
    }

    getRecipesFromPersistence((recipes) => {
        if(recipes.length === 0) { return; }

        let nameMatches = false;
        let tagsMatch = false;
        let ingredientsMatch = false;

        let matching = recipes.filter(recipe => {
            nameMatches = recipe.name.toLowerCase().includes(name.toLowerCase());
            tagsMatch = tags.length === 0 || tags.every(tag => arrayContains(recipe.tags, tag));
            // todo need to update this to handle the sections as well
            ingredientsMatch = ingredients.length === 0 || ingredients.every(ingredient => arrayContains(recipe.ingredients, ingredient));
            // console.log({recipeName: recipe.name, name: nameMatches, recipeTags: recipe.tags, tags: tagsMatch, recipeIngredients: recipe.ingredients, ingredients: ingredientsMatch});
            return nameMatches && tagsMatch && ingredientsMatch;
        });

        if(matching.length === 0) {
            console.log("No matches found");
        } else {
            matching.forEach(match => {
                console.log(match.name);
            });
        }
    });
}

function arrayContains(arr, value) {
    return arr.findIndex(val => val.toLowerCase().includes(value.toLowerCase())) !== -1;
}

function getNameFilter(name, arg) {
    if(!(arg.startsWith("name=") || arg.startsWith("n="))) { return name; }
    let pair = arg.split("=");
    if(pair.length < 2) { return name; }
    return pair[1];
}

function getTagsFilter(tags, arg) {
    if(!(arg.startsWith("tag=") || arg.startsWith("t="))) { return tags; }
    let pair = arg.split("=");
    if(pair.length < 2) { return tags; }
    return pair[1].split(",");
}

function getIngredientsFilter(ingredients, arg) {
    if(!(arg.startsWith("ingredients=") || arg.startsWith("i="))) { return ingredients; }
    let pair = arg.split("=");
    if(pair.length < 2) { return ingredients; }
    return pair[1].split(",");
}

function showUpdateDocumentation() {}

function handleUpdate() {}



function showDeleteDocumentation() {}

function handleDelete() {}



function showPrintDocumentation() {}

function handlePrint() {}



function showOpenDocumentation() {}

function handleOpen() {}



main();




