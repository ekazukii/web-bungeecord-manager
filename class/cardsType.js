var array = []

array.push({
    name: "CpuCard",
    isAllowed: (rank, options, type) => {
        if(type === "home") {
            return !options.blacklistedCards.includes("CpuCard");
        }
        return false;
    }
});


array.push({
    name: "RamCard",
    isAllowed: (rank, options, type) => {
        if(type === "home") {
            return !options.blacklistedCards.includes("RamCard");
        }
        return false;
    }
});


array.push({
    name: "ScriptsCard",
    isAllowed: (rank, options, type) => {
        if(type === "home") {
            return !options.blacklistedCards.includes("ScriptsCard");
        }
        return false;
    }
});

array.push({
    name: 'ServersCard',
    isAllowed: (rank, options, type) => {
        if(type === "home") {
            return !options.blacklistedCards.includes("ServersCard");
        }
        return false;
    }
});

array.push({
    name: 'WhitelistCard',
    isAllowed: (rank, options, type) => {
        if (options.whitelist && rank >= 3 && type === "home") {
            return !options.blacklistedCards.includes("WhitelistCard");
        }
        return false;
    }
});

array.push({
    name: 'ActionsCard',
    isAllowed: (rank, options, type) => {
        if(type === "joueur") {
            return !options.blacklistedCards.includes("ActionsCard");
        }
        return false;
    }
});

array.push({
    name: 'ModerationCard',
    isAllowed: (rank, options, type) => {
        if(rank >= 3 && type === "joueur") {
            return !options.blacklistedCards.includes("ModerationCard");
        }
        return false;
    }
});

array.push({
    name: 'PermsCard',
    isAllowed: (rank, options, type) => {
        if(type === "joueur") {
            return !options.blacklistedCards.includes("PermsCard");
        }
        return false;
    }
});

array.push({
    name: 'PlayersCard',
    isAllowed: (rank, options, type) => {
        if(type === "serveur") {
            return !options.blacklistedCards.includes("PlayersCard");
        }
    }
});

array.push({
    name: 'SendCard',
    isAllowed: (rank, options, type) => {
        if(type === "serveur") {
            return !options.blacklistedCards.includes("SendCard");
        }
    }
});

array.push({
    name: 'ServerCard',
    isAllowed: (rank, options, type) => {
        if(type === "serveur") {
            return !options.blacklistedCards.includes("ServerCard");
        }
    }
});

array.push({
    name: 'ConsoleCard',
    isAllowed: (rank, options, type) => {
        if(rank >= 3 && type === "serveur") {
            return !options.blacklistedCards.includes("ConsoleCard");
        }
        return false;
    }
});

module.exports = array;
