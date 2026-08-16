import type { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form'

import { PLATFORMS, PLATFORMS_ICONS } from '@/global/globals'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

type Props<TFieldValues extends FieldValues, TFieldName extends FieldPath<TFieldValues>> = {
  field: ControllerRenderProps<TFieldValues, TFieldName>
}

const PlatformPicker = <
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues>,
>({
  field,
}: Props<TFieldValues, TFieldName>) => {
  return (
    <Select
      placeholder="Select platform"
      id="platform"
      value={field.value}
      onChange={field.onChange}
      className={'min-w-37.5'}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PLATFORMS.map(platform => (
          <SelectItem id={platform} key={platform} value={platform}>
            <img src={PLATFORMS_ICONS[platform]} alt={`${platform} icon`} className="mr-2 size-4" />
            {platform}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default PlatformPicker
