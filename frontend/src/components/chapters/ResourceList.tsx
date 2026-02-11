import { ExternalLink, BookOpen, Youtube, RefreshCw, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import type { Resource, ResourceStatus } from '../../types';

interface ResourceListProps {
    resources: Resource[];
    resourceStatus: ResourceStatus;
    onDiscover: () => void;
    onRefresh: () => void;
    isDiscovering: boolean;
}

export default function ResourceList({
    resources,
    resourceStatus,
    onDiscover,
    onRefresh,
    isDiscovering,
}: ResourceListProps) {
    const docs = resources?.filter(r => r.type === 'doc').sort((a, b) => a.priority - b.priority) || [];
    const videos = resources?.filter(r => r.type === 'youtube').sort((a, b) => a.priority - b.priority) || [];

    // Loading state
    if (resourceStatus === 'pending' && (!resources || resources.length === 0)) {
        if (isDiscovering) {
            return (
                <div className="mt-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                        Smart Resources
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] py-4">
                        <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" />
                        <span>Discovering the best resources...</span>
                    </div>
                </div>
            );
        }

        return (
            <div className="mt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                    Smart Resources
                </h4>
                <button
                    onClick={onDiscover}
                    className="flex items-center gap-2 text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors font-medium"
                >
                    <Sparkles className="w-4 h-4" />
                    Discover Resources
                </button>
            </div>
        );
    }

    // Failed state
    if (resourceStatus === 'failed') {
        return (
            <div className="mt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                    Smart Resources
                </h4>
                <div className="flex items-center justify-between bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-sm text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span>Could not load resources</span>
                    </div>
                    <button
                        onClick={onRefresh}
                        disabled={isDiscovering}
                        className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3 h-3 ${isDiscovering ? 'animate-spin' : ''}`} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Empty state (completed but no resources)
    if (resourceStatus === 'completed' && resources.length === 0) {
        return (
            <div className="mt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-2">
                    Smart Resources
                </h4>
                <p className="text-sm text-[var(--muted-foreground)]">No resources found for this chapter.</p>
            </div>
        );
    }

    // Resources loaded
    return (
        <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Smart Resources
                </h4>
                <button
                    onClick={onRefresh}
                    disabled={isDiscovering}
                    className="flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors disabled:opacity-50"
                    title="Refresh resources"
                >
                    <RefreshCw className={`w-3 h-3 ${isDiscovering ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="space-y-2">
                {/* Documentation Links */}
                {docs.length > 0 && (
                    <div className="space-y-1.5">
                        {docs.map((resource, idx) => (
                            <a
                                key={`doc-${idx}`}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30 hover:bg-blue-500/10 transition-all group"
                            >
                                <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-[var(--foreground)] truncate">
                                            {resource.title}
                                        </span>
                                        <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                    </div>
                                    {resource.description && (
                                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                                            {resource.description}
                                        </p>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                )}

                {/* YouTube Links */}
                {videos.length > 0 && (
                    <div className="space-y-1.5">
                        {videos.map((resource, idx) => (
                            <a
                                key={`yt-${idx}`}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start gap-2.5 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/10 transition-all group"
                            >
                                <Youtube className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-[var(--foreground)] truncate">
                                            {resource.title}
                                        </span>
                                        <ExternalLink className="w-3 h-3 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                                    </div>
                                    {resource.description && (
                                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 line-clamp-2">
                                            {resource.description}
                                        </p>
                                    )}
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
