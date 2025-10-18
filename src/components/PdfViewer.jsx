import { Document, Page } from 'react-pdf'

const PdfViewer = () => (
  <Document file="./media/Nikoloz Tukhashvili - CV.pdf">
    <Page pageNumber={1} />
  </Document>
)

export default PdfViewer