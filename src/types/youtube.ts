export interface YoutubeVideo {
    kind: string
    etag: string
    id: string
    snippet: {
        publishedAt: string
        channelId: string
        title: string
        description: string
        thumbnails: {
            default: Thumbnail
            medium: Thumbnail
            high: Thumbnail
            standard: Thumbnail
            maxres?: Thumbnail
        }
        channelTitle: string
        tags?: string[]
        categoryId: string
        liveBroadcastContent: string
        defaultLanguage?: string
        localized: {
            title: string
            description: string
        }
        defaultAudioLanguage?: string
    }
    contentDetails: {
        duration: string
        dimension: string
        definition: string
        caption: string | boolean
        licensedContent: boolean
        contentRating: Record<string, unknown>
        projection: string
    }
    statistics: {
        viewCount: string
        likeCount: string
        favoriteCount: string
        commentCount: string
    }
}

interface Thumbnail {
    url: string
    width: number
    height: number
}
