import { useState } from 'react';
import { Loading } from './Loading';

function withLoading(WrappedComponent) {
	return function WithLoadingComponent(props) {
		const [loading, setLoading] = useState(false);

		const handleRequest = (call) => {
			(async () => {
				try {
					setLoading(true);
					await call();
					setLoading(false)
				} catch {
					setLoading(false)
				} finally {
					setLoading(false)
				}
			})()
		};

		return (
			<>
				<Loading show={loading} />
				<WrappedComponent {...props} handleRequest={handleRequest} loading={loading} />
			</>
		)
	};
}

export default withLoading;

