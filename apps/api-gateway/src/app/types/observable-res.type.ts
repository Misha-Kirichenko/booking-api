import { Observable } from "rxjs";
import { AxiosResponse } from 'axios';

export type TObservableRes<T> = Promise<Observable<AxiosResponse<T>>>
