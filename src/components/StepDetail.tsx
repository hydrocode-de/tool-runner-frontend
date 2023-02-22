import { StepContent } from "@hydrocode/tool-runner";

const StepDetail: React.FC<{step: StepContent}> = ({ step }) => {
    return (
        <pre>
            <code>
                { JSON.stringify(step, null, 4) }
            </code>
        </pre>
    )
}

export default StepDetail;