import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import ImageModule from 'docxtemplater-image-module-free'
import { promises as fs } from 'fs'
import { logger } from '../../utils/logger'

interface ImageOptions {
    width?: number
    height?: number
}

export class DocxRenderer {
    private zip: PizZip
    private doc: Docxtemplater

    constructor(buffer: Buffer) {
        this.zip = new PizZip(buffer)

        // Configure image module
        const imageModule = new ImageModule({
            centered: false,
            fileType: 'docx',
            getImage: async (tagValue: string) => {
                try {
                    const response = await fetch(tagValue)
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image: ${response.statusText}`)
                    }
                    const arrayBuffer = await response.arrayBuffer()
                    return {
                        width: 120,
                        height: 40,
                        data: Buffer.from(arrayBuffer),
                        extension: '.png',
                    }
                } catch (error) {
                    logger.error('Error fetching image:', error)
                    return null
                }
            },
            getSize: (img: any, tagValue: string, tagName: string) => {
                // Extract size from tag name or use defaults
                const sizeMatch = tagName.match(/width=(\d+).*height=(\d+)/)
                if (sizeMatch) {
                    return [parseInt(sizeMatch[1]), parseInt(sizeMatch[2])]
                }
                return [120, 40] // Default size
            },
        })

        this.doc = new Docxtemplater(this.zip, {
            paragraphLoop: true,
            linebreaks: true,
            modules: [imageModule],
        })
    }

    public render(data: Record<string, any>): Buffer {
        try {
            // Set the template variables
            this.doc.setData(data)

            // Render the document
            this.doc.render()

            // Get the rendered document as a buffer
            const output = this.doc.getZip().generate({ type: 'nodebuffer' })

            return output
        } catch (error) {
            logger.error('Error rendering document:', error)
            throw new Error(`Failed to render document: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    public static async fromFile(filePath: string): Promise<DocxRenderer> {
        try {
            const buffer = await fs.readFile(filePath)
            return new DocxRenderer(buffer)
        } catch (error) {
            logger.error('Error reading template file:', error)
            throw new Error(`Failed to read template file: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }
}
