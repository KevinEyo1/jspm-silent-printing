import { Button, Container } from '@mui/material'
import React from 'react'
import { Settings } from './ComponentTypes'
import * as JSPM from 'jsprintmanager'
import 

const SilentPrintPage = () => {
    const url = 'https://neodynamic.com/temp/LoremIpsum.pdf'

    const handleAddSettings = () => {
        const settings: Settings = {
            selectedPrinter: 'Wondershare PDFelement',
            selectedPaper: 'A4',
            selectedTray: '',
            printRotation: 'None',
            pagesRange: '1-2',
            printInReverseOrder: true,
            printAnnotations: false,
            printAsGrayscale: false
        }
        localStorage.setItem('silentPageSettings', JSON.stringify(settings))
    }

    const handleSilentPrint = () => {
        const settings = JSON.parse(localStorage.getItem('silentPageSettings') || '{}')
        if (settings.selectedPrinter) {
            const cpj = new JSPM.ClientPrintJob()
            const myPrinter = new JSPM.InstalledPrinter(settings.selectedPrinter)
            myPrinter.paperName = settings.selectedPaper
            myPrinter.trayName = settings.selectedTray
            cpj.clientPrinter = myPrinter

            const my_file = new JSPM.PrintFilePDF(url)
            my_file.printRotation = JSPM.PrintRotation[settings.printRotation as keyof typeof JSPM.PrintRotation]
            my_file.printRange = settings.pagesRange
            my_file.printAnnotations = settings.printAnnotations
            my_file.printAsGrayscale = settings.printAsGrayscale
            my_file.printInReverseOrder = settings.printInReverseOrder

            cpj.files.push(my_file)
            cpj.sendToClient()
        }
    }

  return (
    <Container>
        <Button onClick={handleAddSettings}>
            Add Settings
        </Button>
        <Button onClick={handleSilentPrint}>
            Print
        </Button>
    </Container>
  )
}

export default SilentPrintPage