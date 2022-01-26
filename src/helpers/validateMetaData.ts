import {PROPS, TYPES, TAGS} from '../constants';

export default function validateMetadata(metadata: { [x: string]: any; }) {
    for (const prop of PROPS) {
        let val = metadata[prop];

        // some sanity checks
        if(!val || val.legnth === 0) throw new Error(`Missing or empty property \'${prop}\' in addon.json!`);
        // warn that they don't have an ignore property, not error.
        if (!metadata.ignore) console.error("WARNING: could not find 'ignore' in addon.json. This may cause you to supply unwanted content in your GMA.");

        "awd".toLowerCase();
        if (!TYPES.find(t => t === metadata.type.toLowerCase())) throw new Error(`Invalid type: ${metadata}`);

        for (const tag of metadata.tags) {
            if (!TAGS.find(t => t === tag.toLowerCase())) throw new Error(`Invalid tag: ${tag}`);
        }

        if (!metadata.description) metadata.description = "";
    }
}