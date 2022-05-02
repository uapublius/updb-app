import axios from "axios";
import { baseUrl } from '@/lib/util';
import { reportColumns } from "@/composables/useTabulator/columns";

axios.defaults.baseURL = baseUrl;

export async function getReport(source: number, sourceId: string) {
  try {
    let res = await axios.get('/api/report_view', {
      params: {
        select: reportColumns.join(','),
        source: 'eq.' + source,
        source_id: 'eq.' + sourceId,
        limit: 1
      }
    });

    return res.data?.length ? res.data[0] : null;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getAttachmentsReferences(report: Report) {
  try {
    return Promise.all([
      axios.get('/api/attachment', {
        params: {
          report: 'in.(' + report.id + ')'
        }
      }),
      axios.get('/api/report_reference_view', {
        params: {
          report: 'in.(' + report.id + ')'
        }
      })
    ]);
  } catch (error) {
    console.log(error.message);
    return Promise.resolve();
  }
}
