const path = require('path')
const chalk = require('chalk')
const bufferSplit = require('buffer-split')
const childProcess = require('child_process')
const findParentDir = require('find-parent-dir')

module.exports.spawnModuleBin = (bin, args, options, done) => {
    const binName = path.basename(bin)
    const binPath = path.join(__dirname, 'node_modules', '.bin', bin)
    const isParallel = options.isParallel || false

    console.log(chalk.green('*'), `${binName} started`)

    const p = childProcess.spawn(binPath, args)

    let stderrDataHandler
    let stdoutDataHandler

    if (isParallel) {
        stderrDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.red(`- ${binName}`), line.toString())
            })
        }

        stdoutDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.green(`- ${binName}`), line.toString())
            })
        }
    } else {
        stderrDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.red('|'), line.toString())
            })
        }

        stdoutDataHandler = _ => {
            bufferSplit(_, new Buffer('\n')).forEach((line) => {
                console.log(chalk.green('|'), line.toString())
            })
        }
    }

    p.stderr.on('data', stderrDataHandler)
    p.stdout.on('data', stdoutDataHandler)

    p.on('exit', _ => {
        console.log(chalk.green('*'), `${binName} finished`)

        done()
    })
}
