export interface ILinksWithNames {
    name: string;
    link: string;
}
export interface IBannerPrincipal {
    _id: string;
    image: string;
    imageMobile: string;
    links: ILinksWithNames[];
    status: boolean;
}
