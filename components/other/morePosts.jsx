import Populate from './populate';
import { baseUrl } from '@/services/config/axios';

export default async function morePosts({ bg }) {
    try {
        const data = await fetch(`${baseUrl}/products`, { next: { tags: ['products'] } }).then(res => res.json());
        return <Populate data={data} more bg={bg} />;
    } catch {
        return null;
    }
}
