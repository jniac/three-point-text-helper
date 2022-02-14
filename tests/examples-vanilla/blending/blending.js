import { 
  AdditiveBlending, 
  NormalBlending,
  MultiplyBlending, 
} from 'three'

export const blendingOptions = {
  AdditiveBlending, 
  NormalBlending,
  MultiplyBlending, 
}

export const getBlendingString = () => {
  const hash = window.location.hash.substring(1)
  if (hash in blendingOptions) return hash
  return 'AdditiveBlending'
}

export const getBlending = () => blendingOptions[getBlendingString()]
