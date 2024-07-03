import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction, KernelSize, Resolution } from "postprocessing";

export function PostProcessing() {
    return (
        <EffectComposer>
            <Bloom
                intensity={1.0} // The bloom intensity.
                blurPass={undefined} // A blur pass.
                kernelSize={KernelSize.LARGE} // blur kernel size
                luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
                luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
                mipmapBlur={false} // Enables or disables mipmap blur.
                resolutionX={Resolution.AUTO_SIZE} // The horizontal resolution.
                resolutionY={Resolution.AUTO_SIZE} // The vertical resolution.
            />
            <Vignette
                offset={0.5} // vignette offset
                darkness={0.5} // vignette darkness
                eskil={false} // Eskil's vignette technique
                blendFunction={BlendFunction.NORMAL} // blend mode
            />
            {/* <ToneMapping
                        blendFunction={BlendFunction.NORMAL} // blend mode
                        adaptive={true} // toggle adaptive luminance map usage
                        resolution={256} // texture resolution of the luminance map
                        middleGrey={0.6} // middle grey factor
                        maxLuminance={16.0} // maximum luminance
                        averageLuminance={1.0} // average luminance
                        adaptationRate={1.0} // luminance adaptation rate
                    /> */}
        </EffectComposer>
    );
}
