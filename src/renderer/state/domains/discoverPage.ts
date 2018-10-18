import { AnyAction, Reducer } from 'redux';
import { Selector } from 'reselect';

import { actions } from '~renderer/state/actions';
import { IRootState } from '~renderer/state/rootState';
import { IDiscoverPageAlbum } from '~renderer/ui/DiscoverPage/types';

interface IDiscoverPageState {
  albums: null | IDiscoverPageAlbum[];
  searchValue: string;
  isFailed: boolean;
  isProcessing: boolean;
  isAlbumsOutdated: boolean;
}

const DOMAIN: string = 'discoverPage';

const initialState: IDiscoverPageState = {
  albums: null,
  searchValue: '',
  isFailed: false,
  isProcessing: false,
  isAlbumsOutdated: false
};

// SELECTORS

export const getDiscoverFeedAlbums: Selector<IRootState, IDiscoverPageAlbum> = (
  state: IRootState
): IDiscoverPageAlbum => state[DOMAIN].albums;
export const getDiscoverSearchValue: Selector<IRootState, string> = (
  state: IRootState
): string => state[DOMAIN].searchValue;
export const isDiscoverHasFailed: Selector<IRootState, boolean> = (
  state: IRootState
): boolean => state[DOMAIN].isFailed;
export const isDiscoverPageProcessing: Selector<IRootState, boolean> = (
  state: IRootState
): boolean => state[DOMAIN].isProcessing;
export const isDiscoverAlbumsOutdated: Selector<IRootState, boolean> = (
  state: IRootState
): boolean => state[DOMAIN].isAlbumsOutdated;

const discoverPageReducer: Reducer<IDiscoverPageState> = (
  state: IDiscoverPageState = initialState, action: AnyAction
): IDiscoverPageState => {
  const { type, payload } = action;
  switch (type) {
    case actions.systemDiscoverAlbumsFetch.toString():
      return { ...initialState, isProcessing: true };
    case actions.uiDiscoverPageClosed.toString():
      return { ...initialState };
    case actions.uiDiscoverSearchPerformed.toString():
      return {
        ...initialState,
        searchValue: payload,
        isProcessing: true
      };
    case actions.uiDiscoverSearchCleared.toString():
      return { ...initialState, isProcessing: true };
    case actions.systemDiscoverAlbumsFetchSucceed.toString():
      return {
        ...state,
        albums: payload,
        isProcessing: false,
        isAlbumsOutdated: false
      };
    case actions.systemShareCandidateSaveSucceed.toString():
      if (state.albums) {
        return {
          ...state,
          isAlbumsOutdated: true
        };
      }

      return state;
    case actions.systemAlbumsRecievedCacheTransited.toString(): {
      const { latestCid } = payload;
      if (state.albums && state.albums[0].albumCid !== latestCid) {
        return {
          ...state,
          isAlbumsOutdated: true
        };
      }

      return state;
    }
    case actions.systemDiscoverAlbumsFetchFailed.toString():
      return { ...state, isFailed: true, isProcessing: false };
    default:
      return state;
  }
};

export default discoverPageReducer;
