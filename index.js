#!/usr/bin/env node

async function ask(question) {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    })
    return new Promise(resolve => readline.question(question, ans => {
        readline.close()
        resolve(ans)
    }))

}

async function processApp(token, app) {
    const res = await fetch(`https://discord.com/api/v9/oauth2/tokens/${app.id}`, {
        "headers": {
            "authorization": token
        },
        "body": null,
        "method": "DELETE"
    });

    if (res.status === 204) {
        console.log(`Revoked ${app.application.name} (${app.application.id})`)
    } else {
        console.log(`Failed to revoke ${app.application.name} (${app.application.id})`)
        const json = await res.json()
        if (json.retry_after) {

            console.log(`Waiting ${json.retry_after * 1000 + 1000}ms`)
            await new Promise(resolve => setTimeout(resolve, json.retry_after * 1000 + 1000))
            return await processApp(token, app)
        }
    }
}

async function main() {

    const token = await ask("Enter your token: ")

    const res = await fetch("https://discord.com/api/v9/oauth2/tokens", {
        "headers": {
            "authorization": token
        },
        "body": null,
        "method": "GET"
    }).then(res => res.json())

    if (res.code === 0) {
        console.log("Invalid token")
        return
    }

    console.log("Your authorized apps: ");
    const usedScopes = []
    res.forEach(app => {
        console.log(`- ${app.application.name} - [${app.scopes.join(", ")}]`)

        app.scopes.forEach(scope => {
            const index = usedScopes.findIndex(x => x.name === scope)
            if (index === -1) {
                usedScopes.push({ name: scope, used: 1 })
            } else {
                usedScopes[index].used++
            }

        })
    })

    console.log("\n\nYour authorized scopes: ");
    let i = 0
    usedScopes.forEach(scope => {
        console.log(`- ${scope.name} (${scope.used} apps) - [${i}]`)
        i++
    })

    console.log("Or type 'all' to revoke all scopes")
    const scopeIndex = await ask("Enter the index of the scope you want to revoke: ")

    const scope = usedScopes[scopeIndex]?.name || "all"


    console.log(`Revoking all apps with the scope: ${scope}`)

    let includeScope = []
    res.forEach(app => {
        if (app.scopes.includes(scope) || scope === "all") {
            includeScope.push(app)
        }
    })

    for (const app of includeScope) {
        await processApp(token, app)
    }


    console.log("Done")

}

main()