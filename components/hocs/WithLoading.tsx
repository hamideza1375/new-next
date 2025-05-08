import { useState, ComponentType } from 'react';
import { Loading } from '../universal/Loading';

// Define the additional props that will be injected by the HOC
interface WithLoadingProps {
    handleRequest: <T>(call: () => Promise<T>) => Promise<T>;
    loading: boolean;
}

// Higher-Order Component with proper TypeScript typing
function withLoading<T>(WrappedComponent: ComponentType<T & WithLoadingProps>): ComponentType<T> {
    return function WithLoadingComponent(props: T) {
        const [loading, setLoading] = useState(false);

        const handleRequest = async <T,>(call: () => Promise<T>): Promise<T> => {
            try {
                setLoading(true);
                const result = await call();
                return result;
            } catch (error) {
                throw error; // Re-throw the error to let the calling component handle it
            } finally {
                setLoading(false);
            }
        };

        return (
            <>
                <Loading show={loading} />
                <WrappedComponent {...props} handleRequest={handleRequest} loading={loading} />
            </>
        );
    };
}

export default withLoading;
