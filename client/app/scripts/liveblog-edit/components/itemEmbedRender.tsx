import React from 'react';
import { TwitterEmbed } from 'react-social-media-embed';
import { ItemEmbedGeneric } from './itemEmbedGeneric';
import { IItemMeta, ItemEmbedInfo } from './itemEmbedInfo';
import { ItemEmbedInstagram } from './itemEmbedInstagram';
import { ItemEmbedFacebook } from './itemEmbedFacebook';

interface IProps extends IItemMeta {
    text: string;
}

export const ItemEmbedRender: React.FunctionComponent<IProps> = (props) => {
    switch (props.provider_name) {
    case 'Instagram':
        return (
            <div>
                <ItemEmbedInstagram
                    {...props}
                    style={{ maxWidth: 550, width: '100%' }}
                    captioned={!!props.show_embed_description}
                />
                <ItemEmbedInfo {...props} />
            </div>
        );
    case 'Facebook':
        return (
            <>
                <ItemEmbedFacebook
                    {...props}
                    style={{ maxWidth: 550, width: '100%' }}
                />
                <ItemEmbedInfo {...props} original_url={props.url} />
            </>

        );
    case 'Twitter':
        return (
            <>
                <TwitterEmbed
                    linkText={props.title}
                    url={props.original_url}
                    // @ts-ignore:next-line
                    style={{ maxWidth: 550 }}
                    width="100%"
                />
                <ItemEmbedInfo {...props} credit={props.provider_name} />
            </>
        );
    default:
        return <ItemEmbedGeneric htmlContent={props.text} />;
    }
};
