import { useEffect, useMemo, useState } from "react";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";

const EMPTY_SUBPROJECTS: JenkinsSubproject[] = [];

export function useSubprojectSelection(
    project: string,
    subprojectsProp?: JenkinsSubproject[]
) {
    const subprojects = useMemo(
        () => subprojectsProp ?? EMPTY_SUBPROJECTS,
        [subprojectsProp]
    );
    const hasMultipleSubprojects = subprojects.length > 1;

    const [selectedKey, setSelectedKey] = useState("");

    useEffect(() => {
        if (!project || subprojects.length === 0) {
            setSelectedKey("");
            return;
        }

        if (subprojects.length === 1) {
            setSelectedKey(subprojects[0].key);
            return;
        }

        setSelectedKey((prev) =>
            subprojects.some((s) => s.key === prev) ? prev : subprojects[0].key
        );
    }, [project, subprojects]);

    return { subprojects, hasMultipleSubprojects, selectedKey, setSelectedKey };
}
