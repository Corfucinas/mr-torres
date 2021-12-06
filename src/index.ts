#!/usr/bin/env node
import boxen, { BorderStyle } from 'boxen'
import chalk from 'chalk'
import fs from 'fs'
import { request } from 'https'
import inquirer from 'inquirer'
import open from 'open'
import ora, { Ora } from 'ora'
import path from 'path'

/**
 * @mrtorres Your standard npx contact card
 * @author Pedro Torres
 */

/// Clear the console
process.stdout.write('\x1b[2J')

const prompt: inquirer.PromptModule = inquirer.createPromptModule()

const questions = [
  {
    type: 'list',
    name: 'action',
    message: 'Select an option to get in contact with me:',
    choices: [
      // Send an email
      {
        name: `Send me an ${chalk.green.bold('email')}`,
        value: (): void => {
          open('mailto:corfucinas@protonmail.com')
          console.log("\nDone, I'll reply as soon as possible.\n")
          console.log(`\n ${chalk.green.bold('You can reach me at corfucinas@protonmail.com')}\n`)
        }
      },
      // Download Resume
      {
        name: `Download my ${chalk.blueBright.bold('Resume')}`,
        value: (): void => {
          const loader: Ora = ora({
            text: 'Downloading Resume'
          }).start()
          request(
            'https://absolutearray.com/resume/resume', (res): void => {
              res.pipe(fs.createWriteStream('./pedro-torres-resume.html').on('finish', (): void => {
                const downloadPath: string = path.join(
                  process.cwd(),
                  'pedro-torres.html'
                )
                console.log(`\nResume Downloaded at ${downloadPath} \n`)
                open('./pedro-torres-resume.html')
                loader.succeed('Resume Downloaded')
                loader.stop()
              }))
            }
          ).end()
        }
      },
      // Quit
      {
        name: 'Quit the program.',
        value: (): void => {
          console.log('\nHave a productive day 🤝.\n')
        }
      }
    ]
  }
]

const contactInformation = {
  name: chalk.bold.green('Pedro Torres'),
  work: `${chalk.white('Dealmaker at')} ${chalk
    .hex('#2b82b2')
    .bold('Arete Technology LLC')}`,
  github: chalk.gray('https://github.com/') + chalk.green('corfucinas'),
  linkedin:
    chalk.gray('https://linkedin.com/in/') + chalk.blue('pedro-torres-cruz'),
  web: chalk.cyan('https://absolutearray.com/'),
  npx: `${chalk.red('npx')} ${chalk.white('mr-torres')}`,

  labelWork: chalk.white.bold('       Work:'),
  labelGitHub: chalk.white.bold('     GitHub:'),
  labelLinkedIn: chalk.white.bold('   LinkedIn:'),
  labelWeb: chalk.white.bold('        Web:'),
  labelCard: chalk.white.bold('       Card:')
}

const personalInformation: string = boxen(
  [
    `${contactInformation.name}\n`,
    `${contactInformation.labelWork}  ${contactInformation.work}\n`,
    `${contactInformation.labelGitHub}  ${contactInformation.github}`,
    `${contactInformation.labelLinkedIn}  ${contactInformation.linkedin}`,
    `${contactInformation.labelWeb}  ${contactInformation.web}\n`,
    `${contactInformation.labelCard}  ${contactInformation.npx}\n`,
    `${chalk.italic('My priority is spearheading the creation and development of products.')}`
  ].join('\n'),
  {
    margin: 1,
    float: 'center',
    padding: 1,
    borderStyle: BorderStyle.Double,
    borderColor: 'white'
  }
)

console.log(personalInformation)
const navigationTip: string = `Tip: Try ${chalk.cyanBright.bold('cmd/ctrl + click')} on the links above\n`
console.log(navigationTip)

prompt(questions).then((answer): any => answer.action())
