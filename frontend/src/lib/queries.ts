import { useMutation, useQuery } from '@tanstack/react-query'
import { templatesApi, type RenderRequest } from './api'

export const useInspectTemplate = () => {
    return useMutation({
        mutationFn: templatesApi.inspect,
    })
}

export const useRenderDocument = () => {
    return useMutation({
        mutationFn: templatesApi.render,
    })
}

export const useTemplateSpec = (templateId: string, version?: number) => {
    return useQuery({
        queryKey: ['template-spec', templateId, version],
        queryFn: () => templatesApi.getSpec(templateId, version),
        enabled: !!templateId,
    })
}
