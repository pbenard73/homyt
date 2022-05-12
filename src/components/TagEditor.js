import { useState } from "react"
import { saveMetadata } from "../apis/metadataApi"
import { useApp } from "../redux/appSlice"
import Button from "./Button"
import Form from "./Form"
import Modal from "./Modal"
import Paper from "./Paper"
import TextField from "./TextField"

const TagEditor = ({onClose, tags, file}) => {
    const defaultTags = {
        artist: "",
        album: "",
        title: "",
    }

    const [value, setValue] = useState({...defaultTags, ...tags})

    const fieldData = field => ({
        value: value[field],
        label: field,
        onChange: e => setValue({...value, [field]: e.target.value})
    })


    const onSubmit = async e => {
        e.preventDefault()

        const result = await saveMetadata({}, {file, tags: value})

        if (result.valid === true) {

            onClose?.();
        }

    }
    return (
        <Modal
            open
            onClose={onClose}
        >
            <Paper className="nodrag">
            <h2>{file}</h2>
            <Form onSubmit={onSubmit}>
                <div>
                    {Object.keys(defaultTags).map(field => (
                        <TextField key={field} {...fieldData(field)} />
                        ))} 

                    <Button type="submit">ok</Button>
                </div>
            </Form>
                        </Paper>
        </Modal>
    )
}

export default TagEditor;